"use client";

import { useEffect, useState } from "react";
import { formatPercent } from "@/lib/format";
import { loadModelMetadata } from "@/lib/model";
import type { ModelMetadata } from "@/types/prediction";
import SectionHeading from "./SectionHeading";

const MODEL_FACTS = [
  { label: "Model Architecture", value: "MobileNetV2" },
  { label: "Method", value: "Transfer Learning + Fine-Tuning" },
  { label: "Task", value: "Image Classification" },
  { label: "Number of Classes", value: "6" },
];

const TRAINING_STEPS = [
  "MobileNetV2 is loaded with weights pretrained on ImageNet and its convolutional base is frozen.",
  "A new classification head (pooling, dense layer, dropout and a six-way softmax) is trained on waste images.",
  "The deeper MobileNetV2 blocks are unfrozen and fine-tuned with a much smaller learning rate.",
  "The final model is evaluated once on a held-out test set that was never used for training or tuning.",
  "The model is exported to ONNX and runs in the browser with ONNX Runtime Web.",
];

type MetadataState = { status: "loading" } | { status: "loaded"; metadata: ModelMetadata } | { status: "unavailable" };

export default function ModelInfo() {
  const [state, setState] = useState<MetadataState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    loadModelMetadata()
      .then((metadata) => active && setState({ status: "loaded", metadata }))
      .catch(() => active && setState({ status: "unavailable" }));
    return () => {
      active = false;
    };
  }, []);

  const metadata = state.status === "loaded" ? state.metadata : null;
  const metrics = metadata?.metrics ?? null;
  const metricRows = metrics
    ? [
        { label: "Test accuracy", value: formatPercent(metrics.testAccuracy) },
        { label: "Precision (macro)", value: formatPercent(metrics.macroPrecision) },
        { label: "Recall (macro)", value: formatPercent(metrics.macroRecall) },
        { label: "F1-score (macro)", value: formatPercent(metrics.macroF1) },
      ]
    : null;

  return (
    <section id="about" aria-labelledby="about-heading" className="border-t border-line bg-surface py-16 sm:py-24">
      <div className="page-container">
        <SectionHeading
          id="about-heading"
          eyebrow="About the model"
          title="A lightweight network, adapted to waste"
          description="MobileNetV2 is a compact convolutional neural network designed for mobile devices. Transfer learning reuses the visual features it learned from ImageNet, so a small waste dataset is enough to train an accurate classifier."
        />

        <dl className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {MODEL_FACTS.map(({ label, value }) => (
            <div key={label} className="card-interactive rounded-2xl border border-line bg-canvas p-4 hover:bg-surface sm:p-5">
              <dt className="text-xs font-medium tracking-wide text-ink-subtle uppercase">{label}</dt>
              <dd className="mt-2 text-[0.95rem] leading-snug font-semibold text-balance text-ink sm:text-lg">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-canvas p-6">
            <h3 className="font-semibold text-ink">Training pipeline</h3>
            <ol className="mt-4 space-y-3">
              {TRAINING_STEPS.map((step, index) => (
                <li key={step} className="group flex gap-3 text-sm leading-relaxed text-ink-muted">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-800 transition-colors duration-200 group-hover:bg-brand-600 group-hover:text-white">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-line bg-canvas p-6" aria-live="polite">
            <h3 className="font-semibold text-ink">Evaluation on the held-out test set</h3>
            {metricRows && metrics ? (
              <>
                <dl className="mt-4 grid grid-cols-2 gap-3">
                  {metricRows.map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-xl bg-surface p-4 ring-1 ring-line transition-shadow duration-200 hover:shadow-card hover:ring-brand-200"
                    >
                      <dt className="text-xs text-ink-muted">{label}</dt>
                      <dd className="mt-1 text-xl font-bold text-ink tabular-nums">{value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-xs leading-relaxed text-ink-subtle">
                  Measured on {metrics.testSamples} unseen test images from {metadata?.datasetName}
                  {metadata?.datasetSplit
                    ? ` (split: ${metadata.datasetSplit.train} train / ${metadata.datasetSplit.validation} validation / ${metadata.datasetSplit.test} test)`
                    : ""}
                  . Model version {metadata?.modelVersion}. Real-world photos with cluttered backgrounds may score lower.
                </p>
              </>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-line-strong bg-surface p-5">
                <p className="font-medium text-ink">{state.status === "loading" ? "Loading results…" : "Results pending"}</p>
                {state.status !== "loading" && (
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                    Test accuracy, precision, recall and F1-score will appear here once the model has been trained,
                    evaluated and deployed. No metrics are shown until real evaluation results exist.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
