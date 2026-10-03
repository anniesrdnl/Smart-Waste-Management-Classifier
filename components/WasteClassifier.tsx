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
    <section id="classifier" ref={sectionRef} aria-labelledby="classifier-heading" className="py-12 sm:py-16">
      <div className="page-container">
        <input
          ref={inputRef}
          type="file"
          accept={FILE_INPUT_ACCEPT}
          onChange={handleInputChange}
          className="hidden"
          aria-label="Choose a waste image to upload"
        />

        <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-raised">
          <div className="flex flex-col gap-4 border-b border-line px-5 py-5 sm:px-8 sm:py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div>
              <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">Waste Classifier</p>
              <h2 id="classifier-heading" className="mt-1.5 text-2xl font-bold tracking-tight text-ink sm:text-[1.75rem]">
                Upload Waste Image
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted sm:text-base">
                Upload a clear image of a single waste item for classification.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 lg:justify-end">
              <p className="flex items-center gap-1.5 text-xs text-ink-subtle">
                <Lock className="size-3.5 shrink-0" aria-hidden="true" />
                Processed in your browser, never uploaded
              </p>
              <ModelStatusBadge status={modelStatus} />
            </div>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div className="flex flex-col gap-3 p-3 sm:p-5">
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
              className="@container flex scroll-mt-20 flex-col border-t border-line bg-canvas p-5 sm:p-8 lg:border-t-0 lg:border-l"
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
          </div>

          {phase.name === "result" && (
            <div className="@container border-t border-line motion-safe:animate-fade-up">
              <WasteGuide classId={phase.prediction.classId} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
