import { FileImage, LoaderCircle, RefreshCw, X } from "lucide-react";
import { formatFileSize } from "@/lib/format";
import type { SelectedImage } from "@/types/prediction";

interface ImagePreviewProps {
  image: SelectedImage;
  onReplace: () => void;
  onRemove: () => void;
  onClassify: () => void;
  showClassify: boolean;
  canClassify: boolean;
  isClassifying: boolean;
  classifyHint: string | null;
}

export default function ImagePreview({
  image,
  onReplace,
  onRemove,
  onClassify,
  showClassify,
  canClassify,
  isClassifying,
  classifyHint,
}: ImagePreviewProps) {
  const { file, previewUrl, bitmap } = image;
  const secondaryButton = "btn btn-secondary flex-1 px-4 py-2.5 text-sm sm:flex-none";

  return (
    <div>
      <div className="flex items-center justify-center overflow-hidden rounded-2xl border border-line bg-canvas">
        <img src={previewUrl} alt={`Preview of ${file.name}`} className="max-h-[26rem] w-full object-contain" />
      </div>

      <div className="mt-4 flex items-start gap-3">
        <FileImage className="mt-0.5 size-5 shrink-0 text-ink-subtle" aria-hidden="true" />
        <div className="min-w-0">
          <p className="truncate font-medium text-ink" title={file.name}>
            {file.name}
          </p>
          <p className="text-sm text-ink-muted">
            {formatFileSize(file.size)} · {bitmap.width} × {bitmap.height} px
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        {showClassify && (
          <button
            type="button"
            onClick={onClassify}
            disabled={!canClassify || isClassifying}
            aria-describedby={classifyHint ? "classify-hint" : undefined}
            className="btn btn-primary px-6 py-3 sm:mr-auto"
          >
            {isClassifying && <LoaderCircle className="size-4 motion-safe:animate-spin" aria-hidden="true" />}
            {isClassifying ? "Analyzing image..." : "Classify Waste"}
          </button>
        )}
        <div className="flex gap-3">
          <button type="button" onClick={onReplace} disabled={isClassifying} className={secondaryButton}>
            <RefreshCw className="size-4" aria-hidden="true" />
            Replace Image
          </button>
          <button type="button" onClick={onRemove} disabled={isClassifying} className={secondaryButton}>
            <X className="size-4" aria-hidden="true" />
            Remove Image
          </button>
        </div>
      </div>
      {showClassify && classifyHint && (
        <p id="classify-hint" className="mt-3 text-sm text-ink-muted">
          {classifyHint}
        </p>
      )}
    </div>
  );
}
