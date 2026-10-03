"use client";

import { useEffect, useState, type ReactNode } from "react";
import { BrainCircuit, ChevronDown, Layers, Lock } from "lucide-react";
import { WASTE_CLASS_IDS } from "@/lib/classes";
import { formatPercent } from "@/lib/format";
import { loadModelMetadata } from "@/lib/model";
import { WASTE_INFO } from "@/lib/wasteData";
import type { ModelMetadata } from "@/types/prediction";
import SectionHeading from "./SectionHeading";

const HIGHLIGHTS = [
  {
    icon: BrainCircuit,
    title: "Computer vision",
    text: "The model looks at visual cues such as shape, texture, colour and shine to tell materials apart.",
  },
  {
    icon: Layers,
    title: "Transfer learning",
    text: "It starts from a network that already learned to recognise everyday objects, then is trained further on waste photos.",
  },
  {
    icon: Lock,
    title: "Runs on your device",
    text: "The model is downloaded once and runs in your browser, so your photos never leave your device.",
  },
];

type MetadataState = { status: "loading" } | { status: "loaded"; metadata: ModelMetadata } | { status: "unavailable" };

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
      <dt className="text-sm font-medium text-ink">{label}</dt>
      <dd className="text-sm leading-relaxed text-ink-muted">{children}</dd>
    </div>
  );
}

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
  const metricChips = metrics
    ? [
        { label: "Accuracy", value: metrics.testAccuracy },
        { label: "Precision", value: metrics.macroPrecision },
        { label: "Recall", value: metrics.macroRecall },
        { label: "F1-score", value: metrics.macroF1 },
      ]
    : [];

  return (
    <section id="about" aria-labelledby="about-heading" className="border-t border-line bg-surface py-16 sm:py-24">
      <div className="page-container">
        <SectionHeading
          id="about-heading"
          eyebrow="About the Technology"
          title="Recognising materials from pixels"
          description="SmartWaste uses computer vision and transfer learning to recognise common waste materials. Here's what that means in practice."
        />

        <ul className="mt-10 grid gap-3 sm:gap-4 md:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="group card-interactive rounded-2xl border border-line bg-canvas p-5 hover:bg-surface">
              <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors duration-200 group-hover:bg-brand-600 group-hover:text-white">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-semibold text-ink">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{text}</p>
            </li>
          ))}
        </ul>

        <details className="group/details mt-4 rounded-2xl border border-line bg-canvas transition-colors duration-200 open:bg-surface hover:border-line-strong">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 select-none [&::-webkit-details-marker]:hidden">
            <span>
              <span className="font-semibold text-ink">Technical details</span>
              <span className="mt-0.5 block text-sm text-ink-muted">
                Model, classes, preprocessing, evaluation and limitations
              </span>
            </span>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-[transform,background-color] duration-200 group-hover/details:bg-line/50 group-open/details:rotate-180">
              <ChevronDown className="size-4" aria-hidden="true" />
            </span>
          </summary>
          <dl className="divide-y divide-line border-t border-line px-5">
            <DetailRow label="Model architecture">
              MobileNetV2 pretrained on ImageNet, with a new classification head (global average pooling, a 256-unit
              dense layer, dropout and a six-way softmax). The deepest blocks were fine-tuned with a small learning rate.
            </DetailRow>
            <DetailRow label="Supported classes">{WASTE_CLASS_IDS.map((id) => WASTE_INFO[id].label).join(", ")}</DetailRow>
            <DetailRow label="Image preprocessing">
              The image is resized to 224 × 224 pixels in RGB and scaled to the range MobileNetV2 expects, identically to
              how the training images were prepared.
            </DetailRow>
            <DetailRow label="Training data">
              {metadata
                ? `${metadata.datasetName}${
                    metadata.datasetSplit
                      ? ` — ${metadata.datasetSplit.train} training, ${metadata.datasetSplit.validation} validation and ${metadata.datasetSplit.test} test images`
                      : ""
                  }.`
                : state.status === "loading"
                  ? "Loading…"
                  : "Available once the trained model is deployed."}
            </DetailRow>
            <DetailRow label="Test results">
              {metrics ? (
                <span className="flex flex-wrap gap-2">
                  {metricChips.map(({ label, value }) => (
                    <span key={label} className="inline-flex items-baseline gap-1.5 rounded-lg bg-canvas px-2.5 py-1 ring-1 ring-line">
                      <span className="text-xs">{label}</span>
                      <span className="font-semibold text-ink tabular-nums">{formatPercent(value)}</span>
                    </span>
                  ))}
                  <span className="basis-full text-xs text-ink-subtle">
                    Macro averages on {metrics.testSamples} held-out test images that were never used during training.
                  </span>
                </span>
              ) : state.status === "loading" ? (
                "Loading…"
              ) : (
                "Pending — results appear here once the trained model is deployed."
              )}
            </DetailRow>
            <DetailRow label="Limitations">
              The model only knows six categories and was trained on a limited set of photos. Unusual angles, cluttered
              scenes, mixed materials or poor lighting can lead to wrong predictions, sometimes with high confidence.
            </DetailRow>
          </dl>
        </details>
      </div>
    </section>
  );
}
