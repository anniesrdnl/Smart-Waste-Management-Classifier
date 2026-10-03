import { ChartNoAxesColumn, Check, LoaderCircle, ScanSearch } from "lucide-react";
import { WASTE_CLASS_IDS } from "@/lib/classes";
import { WASTE_INFO } from "@/lib/wasteData";
import CategoryIcon from "./CategoryIcon";

const PHOTO_TIPS = [
  "One waste item per photo",
  "Good, even lighting",
  "Plain, uncluttered background",
  "The item fills most of the frame",
];

interface ResultPlaceholderProps {
  state: "empty" | "selected" | "classifying";
  onClassify: () => void;
  canClassify: boolean;
  classifyHint: string | null;
}

const COPY = {
  empty: {
    title: "Awaiting an image",
    text: "Upload a photo and the predicted category, confidence scores and disposal guidance will appear here.",
  },
  selected: {
    title: "Ready to analyze",
    text: "Click Analyze Waste to identify the material in your image.",
  },
  classifying: {
    title: "Analyzing image...",
    text: "The model is examining the image on your device.",
  },
} as const;

export default function ResultPlaceholder({ state, onClassify, canClassify, classifyHint }: ResultPlaceholderProps) {
  const { title, text } = COPY[state];
  const classifying = state === "classifying";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start gap-4">
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl ring-1 transition-colors duration-200 ${
            state === "empty" ? "bg-surface text-ink-subtle ring-line" : "bg-brand-600 text-white ring-brand-600"
          }`}
        >
          {classifying ? (
            <LoaderCircle className="size-5 motion-safe:animate-spin" aria-hidden="true" />
          ) : (
            <ChartNoAxesColumn className="size-5" aria-hidden="true" />
          )}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">Classification Result</p>
          <h3 className="mt-1 text-lg font-semibold text-ink" role={classifying ? "status" : undefined}>
            {title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">{text}</p>
        </div>
      </div>

      {state !== "empty" && (
        <div className="mt-5">
          <button
            type="button"
            onClick={onClassify}
            disabled={!canClassify || classifying}
            aria-describedby={classifyHint ? "classify-hint" : undefined}
            className="btn btn-primary w-full py-3"
          >
            {classifying ? (
              <LoaderCircle className="size-4 motion-safe:animate-spin" aria-hidden="true" />
            ) : (
              <ScanSearch className="size-4" aria-hidden="true" />
            )}
            {classifying ? "Analyzing image..." : "Analyze Waste"}
          </button>
          {classifyHint && (
            <p id="classify-hint" className="mt-2 text-sm text-ink-muted">
              {classifyHint}
            </p>
          )}
        </div>
      )}

      <ul
        className={`mt-5 space-y-1 rounded-xl border border-dashed border-line-strong bg-surface/60 p-3 sm:block sm:p-4 ${
          state === "empty" ? "hidden" : ""
        }`}
        aria-hidden="true"
      >
        {WASTE_CLASS_IDS.map((id, index) => (
          <li key={id} className="grid grid-cols-[1.25rem_5.5rem_1fr_2.5rem] items-center gap-3 px-1 py-0.5 @sm:grid-cols-[1.25rem_6rem_1fr_2.5rem]">
            <CategoryIcon classId={id} className="size-4 text-ink-subtle" />
            <span className="text-sm text-ink-subtle">{WASTE_INFO[id].label}</span>
            <span className="h-2 overflow-hidden rounded-full bg-line">
              {classifying && (
                <span
                  className="block h-full w-2/5 rounded-full bg-brand-200 motion-safe:animate-pulse"
                  style={{ animationDelay: `${index * 120}ms` }}
                />
              )}
            </span>
            <span className="text-right text-sm text-ink-subtle/70 tabular-nums">—</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-5">
        <p className="text-xs font-semibold text-ink-muted">For the most reliable result</p>
        <ul className="mt-2.5 grid gap-x-4 gap-y-2 @[32rem]:grid-cols-2">
          {PHOTO_TIPS.map((tip) => (
            <li key={tip} className="flex items-center gap-2 text-sm text-ink-muted">
              <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <Check className="size-2.5" strokeWidth={3} aria-hidden="true" />
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
