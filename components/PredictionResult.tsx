import type { Ref } from "react";
import { ArrowDownRight, CircleHelp, RotateCcw } from "lucide-react";
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
  const uncertain = prediction.confidence < LOW_CONFIDENCE_THRESHOLD;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium tracking-wide text-ink-subtle uppercase">Classification Result</p>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {uncertain ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 ring-1 ring-amber-200">
                <CircleHelp className="size-3.5" aria-hidden="true" />
                Uncertain result
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-800 ring-1 ring-brand-200">
                <CategoryIcon classId={prediction.classId} className="size-3.5" />
                {info.label}
              </span>
            )}
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="mt-2 text-3xl font-bold tracking-tight text-ink focus:outline-none"
            >
              {uncertain ? `Possibly ${info.label}` : info.label}
            </h3>
            <p className="mt-1 flex items-baseline gap-1.5">
              <span className={`text-lg font-semibold tabular-nums ${uncertain ? "text-amber-800" : "text-brand-700"}`}>
                {formatPercent(prediction.confidence)}
              </span>
              <span className="text-sm text-ink-muted">confidence</span>
            </p>
          </div>
          <span
            className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${
              uncertain ? "bg-amber-50 text-amber-800" : "bg-brand-600 text-white"
            }`}
          >
            <CategoryIcon classId={prediction.classId} className="size-7" />
          </span>
        </div>

        {uncertain && (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-relaxed text-amber-950">
            The model is not confident about this image, so treat this as a best guess. For a more reliable result,
            upload a clearer photo of a single item on a plain background.
          </p>
        )}
      </div>

      <div>
        <h4 className="text-sm font-semibold text-ink">Confidence by category</h4>
        <ul className="-mx-2 mt-2 space-y-0.5">
          {prediction.probabilities.map((entry, index) => (
            <li key={entry.classId}>
              <ConfidenceBar entry={entry} highlighted={index === 0} />
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs leading-relaxed text-ink-subtle">
          Scores show how strongly the model favours each category. They are not a guarantee. Computed on your device in{" "}
          {Math.round(prediction.inferenceMs)} ms.
        </p>
      </div>

      <WasteGuide classId={prediction.classId} />

      <div className="flex flex-col gap-2.5">
        <button type="button" onClick={onReset} className="group btn btn-primary px-5 py-3">
          <RotateCcw className="size-4 transition-transform duration-300 group-hover:-rotate-90" aria-hidden="true" />
          Classify Another
        </button>
        <a href={`#category-${prediction.classId}`} className="group btn btn-secondary px-5 py-3">
          Learn About This Category
          <ArrowDownRight
            className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
  );
}
