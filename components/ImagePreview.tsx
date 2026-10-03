import { FileImage, RefreshCw, X } from "lucide-react";
import { formatFileSize, formatPercent } from "@/lib/format";
import { WASTE_INFO } from "@/lib/wasteData";
import type { Prediction, SelectedImage } from "@/types/prediction";
import CategoryIcon from "./CategoryIcon";
import { LOW_CONFIDENCE_THRESHOLD } from "./PredictionResult";

interface ImagePreviewProps {
  image: SelectedImage;
  onReplace: () => void;
  onRemove: () => void;
  isClassifying: boolean;
  prediction: Prediction | null;
}

export default function ImagePreview({ image, onReplace, onRemove, isClassifying, prediction }: ImagePreviewProps) {
  const { file, previewUrl, bitmap } = image;
  const toolbarButton = "btn btn-secondary size-9 p-0 text-sm sm:size-auto sm:px-3 sm:py-2";
  const uncertain = prediction !== null && prediction.confidence < LOW_CONFIDENCE_THRESHOLD;

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] border border-line bg-canvas lg:aspect-auto lg:h-full lg:min-h-[clamp(26rem,calc(100svh-20rem),36rem)]">
      <span
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
        aria-hidden="true"
      />
      <img
        src={previewUrl}
        alt={`Preview of ${file.name}`}
        className="absolute inset-0 size-full object-contain p-4 pb-18 drop-shadow-[0_8px_24px_rgb(28_31_29/0.12)] sm:p-8 sm:pb-22"
      />

      {isClassifying && (
        <div className="pointer-events-none absolute inset-0 bg-brand-600/5" aria-hidden="true">
          <span className="absolute inset-x-0 h-0.5 bg-brand-500 shadow-[0_0_18px_4px_rgb(47_154_82/0.45)] motion-safe:animate-sweep" />
        </div>
      )}

      {prediction && (
        <span
          className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold shadow-card motion-safe:animate-fade-up ${
            uncertain ? "bg-amber-50 text-amber-900 ring-1 ring-amber-200" : "bg-brand-600 text-white"
          }`}
        >
          <CategoryIcon classId={prediction.classId} className="size-3.5" />
          {uncertain ? `Possibly ${WASTE_INFO[prediction.classId].label}` : WASTE_INFO[prediction.classId].label}
          <span className="tabular-nums opacity-80">{formatPercent(prediction.confidence)}</span>
        </span>
      )}

      <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-xl border border-line bg-surface/90 p-2 pl-3 shadow-card backdrop-blur-md">
        <FileImage className="size-5 shrink-0 text-ink-subtle" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink" title={file.name}>
            {file.name}
          </p>
          <p className="text-xs text-ink-muted">
            {formatFileSize(file.size)} · {bitmap.width} × {bitmap.height} px
          </p>
        </div>
        <button
          type="button"
          onClick={onReplace}
          disabled={isClassifying}
          aria-label="Replace Image"
          title="Replace image"
          className={toolbarButton}
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Replace</span>
        </button>
        <button
          type="button"
          onClick={onRemove}
          disabled={isClassifying}
          aria-label="Remove Image"
          title="Remove image"
          className={toolbarButton}
        >
          <X className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Remove</span>
        </button>
      </div>
    </div>
  );
}
