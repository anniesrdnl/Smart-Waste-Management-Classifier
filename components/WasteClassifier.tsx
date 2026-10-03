"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { Lock } from "lucide-react";
import { ClassifierError, toClassifierError } from "@/lib/errors";
import { FILE_INPUT_ACCEPT, decodeImage, validateImageFile } from "@/lib/preprocess";
import { useClassifierModel } from "@/lib/useClassifierModel";
import type { Prediction, SelectedImage } from "@/types/prediction";
import ErrorAlert from "./ErrorAlert";
import ImagePreview from "./ImagePreview";
import ImageUploader from "./ImageUploader";
import ModelStatusBadge from "./ModelStatusBadge";
import PredictionResult from "./PredictionResult";
import ResultPlaceholder from "./ResultPlaceholder";
import SectionHeading from "./SectionHeading";
import WasteGuide from "./WasteGuide";

type Phase =
  | { name: "empty" }
  | { name: "selected"; image: SelectedImage }
  | { name: "classifying"; image: SelectedImage }
  | { name: "result"; image: SelectedImage; prediction: Prediction };

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
    <section id="classifier" ref={sectionRef} aria-labelledby="classifier-heading" className="pt-12 pb-16 sm:pt-14 sm:pb-20">
      <div className="page-container">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between xl:gap-10">
          <SectionHeading
            id="classifier-heading"
            eyebrow="Waste Classifier"
            title="Identify a waste item in seconds"
            description="The model runs directly in your browser. Upload an image, review it, then analyze."
          />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 xl:flex-col xl:items-end xl:pb-1">
            <ModelStatusBadge status={modelStatus} />
            <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-subtle xl:text-right">
              <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              Your image is processed locally in your browser and is never uploaded or stored.
            </p>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={FILE_INPUT_ACCEPT}
          onChange={handleInputChange}
          className="hidden"
          aria-label="Choose a waste image to upload"
        />

        <div className="mt-7 grid gap-2 rounded-[1.75rem] border border-line bg-surface p-2 shadow-raised sm:gap-2.5 sm:p-2.5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-2">
            <div className="flex-1">
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
                  isClassifying={phase.name === "classifying"}
                  prediction={phase.name === "result" ? phase.prediction : null}
                />
              )}
            </div>
            {error && <ErrorAlert error={error} onDismiss={() => setError(null)} />}
          </div>

          <div
            ref={resultRef}
            className="@container flex flex-col rounded-[1.25rem] border border-line bg-canvas p-5 sm:p-7"
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

            <div key={phase.name === "result" ? "result" : "idle"} className="flex-1 motion-safe:animate-fade-up">
              {phase.name === "result" ? (
                <PredictionResult prediction={phase.prediction} onReset={classifyAnother} headingRef={resultHeadingRef} />
              ) : (
                <ResultPlaceholder
                  state={phase.name}
                  onClassify={() => void classify()}
                  canClassify={modelStatus === "ready"}
                  classifyHint={classifyHint}
                />
              )}
            </div>
          </div>

          {phase.name === "result" && (
            <div className="@container motion-safe:animate-fade-up lg:col-span-2">
              <WasteGuide classId={phase.prediction.classId} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
