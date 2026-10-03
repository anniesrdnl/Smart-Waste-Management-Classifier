import type { Ref } from "react";
import { RotateCcw } from "lucide-react";
import { formatPercent } from "@/lib/format";
import { WASTE_INFO } from "@/lib/wasteData";
import type { Prediction } from "@/types/prediction";
import CategoryIcon from "./CategoryIcon";
import ConfidenceBar from "./ConfidenceBar";
import WasteGuide from "./WasteGuide";

const LOW_CONFIDENCE_THRESHOLD = 0.6;

interface PredictionResultProps {
  prediction: Prediction;
  onReset: () => void;
  headingRef?: Ref<HTMLHeadingElement>;
}

export default function PredictionResult({ prediction, onReset, headingRef }: PredictionResultProps) {
  const info = WASTE_INFO[prediction.classId];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink-muted">Predicted Waste</p>
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="mt-1 text-3xl font-extrabold tracking-wide text-ink uppercase focus:outline-none"
          >
            {info.label}
          </h3>
          <p className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-brand-700 tabular-nums">{formatPercent(prediction.confidence)}</span>
            <span className="text-sm text-ink-muted">confidence</span>
          </p>
        </div>
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <CategoryIcon classId={prediction.classId} className="size-7" />
        </span>
      </div>

      {prediction.confidence < LOW_CONFIDENCE_THRESHOLD && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-relaxed text-amber-900">
          The model is not very certain about this image. For a more reliable result, try a clear photo of a single item
          on a plain background.
        </p>
      )}

      <div>
        <h4 className="mb-3 text-sm font-semibold text-ink">Prediction Confidence</h4>
        <ul className="-mx-2 space-y-0.5">
          {prediction.probabilities.map((entry, index) => (
            <li key={entry.classId}>
              <ConfidenceBar entry={entry} highlighted={index === 0} />
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink-subtle">
          Computed in your browser in {Math.round(prediction.inferenceMs)} ms.
        </p>
      </div>

      <WasteGuide classId={prediction.classId} />

      <button
        type="button"
        onClick={onReset}
        className="group btn btn-primary w-full px-6 py-3"
      >
        <RotateCcw className="size-4 transition-transform duration-300 group-hover:-rotate-90" aria-hidden="true" />
        Classify Another Image
      </button>
    </div>
  );
}
