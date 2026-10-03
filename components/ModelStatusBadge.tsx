import type { ModelStatus } from "@/types/prediction";

const STATUS_DISPLAY: Record<ModelStatus, { label: string; dot: string }> = {
  idle: { label: "Model not loaded", dot: "bg-ink-subtle" },
  loading: { label: "Loading classification model...", dot: "bg-amber-500 motion-safe:animate-pulse" },
  ready: { label: "Model ready", dot: "bg-brand-500" },
  error: { label: "Model unavailable", dot: "bg-red-600" },
};

export default function ModelStatusBadge({ status }: { status: ModelStatus }) {
  const { label, dot } = STATUS_DISPLAY[status];
  return (
    <p
      role="status"
      className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1 text-xs font-medium text-ink-muted"
    >
      <span className={`size-2 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </p>
  );
}
