import { formatPercent } from "@/lib/format";
import { WASTE_INFO } from "@/lib/wasteData";
import type { ClassProbability } from "@/types/prediction";

interface ConfidenceBarProps {
  entry: ClassProbability;
  highlighted: boolean;
}

export default function ConfidenceBar({ entry, highlighted }: ConfidenceBarProps) {
  const percent = formatPercent(entry.probability);
  return (
    <div className="group grid grid-cols-[5.5rem_1fr_4.5rem] items-center gap-3 rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-canvas sm:grid-cols-[6.5rem_1fr_4.5rem]">
      <span className={`text-sm ${highlighted ? "font-semibold text-ink" : "text-ink-muted"}`}>
        {WASTE_INFO[entry.classId].label}
      </span>
      <div className="h-2.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div
          className={`h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500 motion-safe:ease-out ${
            highlighted ? "bg-brand-600" : "bg-ink-subtle/50 group-hover:bg-ink-subtle/80"
          }`}
          style={{ width: percent }}
        />
      </div>
      <span className={`text-right text-sm tabular-nums ${highlighted ? "font-semibold text-ink" : "text-ink-muted"}`}>
        {percent}
      </span>
    </div>
  );
}
