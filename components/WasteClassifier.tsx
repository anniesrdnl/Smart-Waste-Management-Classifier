"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { ChartNoAxesColumn, LoaderCircle, Lock } from "lucide-react";
import { ClassifierError, toClassifierError } from "@/lib/errors";
import { FILE_INPUT_ACCEPT, decodeImage, validateImageFile } from "@/lib/preprocess";
import { useClassifierModel } from "@/lib/useClassifierModel";
import type { Prediction, SelectedImage } from "@/types/prediction";
import ErrorAlert from "./ErrorAlert";
import ImagePreview from "./ImagePreview";
import ImageUploader from "./ImageUploader";
import ModelStatusBadge from "./ModelStatusBadge";
import PredictionResult from "./PredictionResult";
import SectionHeading from "./SectionHeading";

type Phase =
  | { name: "empty" }
  | { name: "selected"; image: SelectedImage }
  | { name: "classifying"; image: SelectedImage }
  | { name: "result"; image: SelectedImage; prediction: Prediction };

const PHOTO_TIPS = [
  "One waste item per photo",
  "Good, even lighting",
  "Plain, uncluttered background",
  "The item fills most of the frame",
];

function releaseImage(image: SelectedImage | null) {
  if (!image) return;
  URL.revokeObjectURL(image.previewUrl);
  image.bitmap.close();
}

export default function WasteClassifier() {
  const { status: modelStatus, error: modelError, modelRef, load: loadModel } = useClassifierModel();
  const [phase, setPhase] = useState<Phase>({ name: "empty" });
  const [error, setError] = useState<ClassifierError | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const browseButtonRef = useRef<HTMLButtonElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const currentImageRef = useRef<SelectedImage | null>(null);
  const selectionIdRef = useRef(0);

  const setCurrentImage = useCallback((next: SelectedImage | null) => {
    if (currentImageRef.current !== next) releaseImage(currentImageRef.current);
    currentImageRef.current = next;
  }, []);

  useEffect(() => () => setCurrentImage(null), [setCurrentImage]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) {
      loadModel();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadModel();
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [loadModel]);

  useEffect(() => {
    const preventFileDropNavigation = (event: DragEvent) => {
      if (event.dataTransfer?.types.includes("Files")) event.preventDefault();
    };
    window.addEventListener("dragover", preventFileDropNavigation);
    window.addEventListener("drop", preventFileDropNavigation);
    return () => {
      window.removeEventListener("dragover", preventFileDropNavigation);
      window.removeEventListener("drop", preventFileDropNavigation);
    };
  }, []);

  useEffect(() => {
    if (phase.name !== "result") return;
    const container = resultRef.current;
    if (container) {
      const { top } = container.getBoundingClientRect();
      if (top < 0 || top > window.innerHeight * 0.6) {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        container.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" });
      }
    }
    resultHeadingRef.current?.focus({ preventScroll: true });
  }, [phase.name]);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      const selectionId = ++selectionIdRef.current;
      setError(null);
      try {
        validateImageFile(file);
        setIsDecoding(true);
        const bitmap = await decodeImage(file);
        if (selectionId !== selectionIdRef.current) {
          bitmap.close();
          return;
        }
        const image: SelectedImage = { file, bitmap, previewUrl: URL.createObjectURL(file) };
        setCurrentImage(image);
        setPhase({ name: "selected", image });
      } catch (caught) {
        if (selectionId === selectionIdRef.current) setError(toClassifierError(caught, "decode-failed"));
      } finally {
        if (selectionId === selectionIdRef.current) setIsDecoding(false);
      }
    },
    [setCurrentImage],
  );

  const openFilePicker = () => inputRef.current?.click();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    void handleFile(file);
  };

  const reset = () => {
    selectionIdRef.current += 1;
    setCurrentImage(null);
    setPhase({ name: "empty" });
    setError(null);
    setIsDecoding(false);
  };

  const classifyAnother = () => {
    reset();
    sectionRef.current?.scrollIntoView({ block: "start" });
    requestAnimationFrame(() => browseButtonRef.current?.focus({ preventScroll: true }));
  };

  const classify = async () => {
    if (phase.name !== "selected") return;
    const model = modelRef.current;
    if (!model) return;
    const { image } = phase;
    setError(null);
    setPhase({ name: "classifying", image });
    try {
      const prediction = await model.classify(image.bitmap);
      if (currentImageRef.current === image) setPhase({ name: "result", image, prediction });
    } catch (caught) {
      if (currentImageRef.current !== image) return;
      setPhase({ name: "selected", image });
      setError(toClassifierError(caught, "prediction-failed"));
    }
  };

  const classifyHint =
    modelStatus === "ready"
      ? null
      : modelStatus === "error"
        ? "Classification is unavailable because the model could not be loaded."
        : "Classification will be available once the model has loaded.";

  return (
    <section
      id="classifier"
      ref={sectionRef}
      aria-labelledby="classifier-heading"
      className="py-16 sm:py-24"
    >
      <div className="page-container">
        <SectionHeading
          id="classifier-heading"
          eyebrow="Classifier"
          title="Classify a waste item"
          description="Upload an existing photo of a single waste item. Review the preview, then run the MobileNetV2 model to see its prediction and the probability for every category."
        />

        <input
          ref={inputRef}
          type="file"
          accept={FILE_INPUT_ACCEPT}
          onChange={handleInputChange}
          className="hidden"
          aria-label="Choose a waste image to upload"
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="space-y-4 rounded-3xl border border-line bg-surface p-4 shadow-card sm:p-6">
            {phase.name === "empty" ? (
              <ImageUploader
                onBrowse={openFilePicker}
                onFileDropped={(file) => void handleFile(file)}
                isProcessing={isDecoding}
                browseButtonRef={browseButtonRef}
              />
            ) : (
              <ImagePreview
                image={phase.image}
                onReplace={openFilePicker}
                onRemove={reset}
                onClassify={() => void classify()}
                showClassify={phase.name !== "result"}
                canClassify={modelStatus === "ready"}
                isClassifying={phase.name === "classifying"}
                classifyHint={classifyHint}
              />
            )}

            {error && <ErrorAlert error={error} onDismiss={() => setError(null)} />}

            <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-subtle">
              <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              Your image is processed locally in your browser for classification and is not uploaded or stored by Smart
              Waste.
            </p>
          </div>

          <div
            ref={resultRef}
            className="rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-6"
            aria-busy={phase.name === "classifying"}
          >
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold tracking-wide text-ink-muted uppercase">Analysis</h3>
              <ModelStatusBadge status={modelStatus} />
            </div>

            {modelError && (
              <div className="mb-6">
                <ErrorAlert
                  error={modelError}
                  action={
                    modelError.code === "model-load-failed" ? { label: "Retry loading model", onClick: loadModel } : undefined
                  }
                />
              </div>
            )}

            {phase.name === "result" ? (
              <PredictionResult prediction={phase.prediction} onReset={classifyAnother} headingRef={resultHeadingRef} />
            ) : phase.name === "classifying" ? (
              <div className="flex min-h-64 flex-col items-center justify-center text-center" role="status">
                <LoaderCircle className="size-8 text-brand-600 motion-safe:animate-spin" aria-hidden="true" />
                <p className="mt-4 font-semibold text-ink">Analyzing image...</p>
                <p className="mt-1 text-sm text-ink-muted">Running MobileNetV2 in your browser.</p>
              </div>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-canvas text-ink-subtle ring-1 ring-line">
                  <ChartNoAxesColumn className="size-6" aria-hidden="true" />
                </span>
                <p className="mt-4 font-semibold text-ink">
                  {phase.name === "selected" ? "Ready when you are" : "Results will appear here"}
                </p>
                <p className="mt-1 max-w-xs text-sm text-ink-muted">
                  {phase.name === "selected"
                    ? "Click Classify Waste to analyse the selected image."
                    : "Upload an image to get started. For the best results, use:"}
                </p>
                {phase.name === "empty" && (
                  <ul className="mt-4 space-y-1.5 text-left text-sm text-ink-muted">
                    {PHOTO_TIPS.map((tip) => (
                      <li key={tip} className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-brand-500" aria-hidden="true" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
