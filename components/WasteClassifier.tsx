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
        ? "Analysis is unavailable because the model could not be loaded."
        : "Analysis will be available as soon as the model has loaded.";

  return (
    <section id="classifier" ref={sectionRef} aria-labelledby="classifier-heading" className="py-16 sm:py-24">
      <div className="page-container">
        <SectionHeading
          id="classifier-heading"
          eyebrow="Waste Classifier"
          title="Identify a waste item in seconds"
          description="The model runs directly in your browser. Upload an image, review it, then analyze."
        />

        <input
          ref={inputRef}
          type="file"
          accept={FILE_INPUT_ACCEPT}
          onChange={handleInputChange}
          className="hidden"
          aria-label="Choose a waste image to upload"
        />

        <div className="mt-10 rounded-[1.75rem] border border-line bg-surface shadow-raised">
          <div className="flex flex-col items-start gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-5">
            <div>
              <h3 className="text-lg font-semibold text-ink">Upload Waste Image</h3>
              <p className="text-sm text-ink-muted">Upload a clear image of a single waste item for classification.</p>
            </div>
            <ModelStatusBadge status={modelStatus} />
          </div>

          <div className="grid gap-6 p-4 sm:p-7 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-8">
            <div className="space-y-4">
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
                Your image is processed locally in your browser and is never uploaded or stored.
              </p>
            </div>

            <div
              ref={resultRef}
              className="rounded-2xl border border-line bg-canvas p-5 sm:p-6"
              aria-busy={phase.name === "classifying"}
              aria-live="polite"
            >
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
                <div key="result" className="motion-safe:animate-fade-up">
                  <PredictionResult prediction={phase.prediction} onReset={classifyAnother} headingRef={resultHeadingRef} />
                </div>
              ) : phase.name === "classifying" ? (
                <div
                  key="classifying"
                  className="flex min-h-56 flex-col items-center justify-center text-center motion-safe:animate-fade-up lg:min-h-72"
                  role="status"
                >
                  <span className="relative flex size-14 items-center justify-center">
                    <span className="absolute inset-0 rounded-full border-2 border-brand-100" aria-hidden="true" />
                    <LoaderCircle className="size-14 text-brand-600 motion-safe:animate-spin" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <p className="mt-5 font-semibold text-ink">Analyzing image...</p>
                  <p className="mt-1 text-sm text-ink-muted">The model is examining the image on your device.</p>
                </div>
              ) : (
                <div key="idle" className="flex flex-col justify-center motion-safe:animate-fade-up lg:min-h-72">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-surface text-ink-subtle ring-1 ring-line">
                    <ChartNoAxesColumn className="size-5" aria-hidden="true" />
                  </span>
                  <p className="mt-4 font-semibold text-ink">
                    {phase.name === "selected" ? "Ready to analyze" : "Classification Result"}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                    {phase.name === "selected"
                      ? "Click Analyze Waste to identify the material in your image."
                      : "Your result and disposal guidance will appear here. For the most reliable result, use:"}
                  </p>
                  {phase.name === "empty" && (
                    <ul className="mt-4 space-y-2 text-sm text-ink-muted">
                      {PHOTO_TIPS.map((tip) => (
                        <li key={tip} className="flex items-center gap-2.5">
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
      </div>
    </section>
  );
}
