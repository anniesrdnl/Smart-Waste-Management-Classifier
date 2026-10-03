import { CircleAlert, CircleCheck, Info, type LucideIcon } from "lucide-react";
import type { WasteClassId } from "@/lib/classes";
import { LOCAL_RULES_NOTICE, WASTE_INFO, type Recyclability } from "@/lib/wasteData";

const RECYCLABILITY_STYLE: Record<Recyclability, { icon: LucideIcon; className: string }> = {
  recyclable: { icon: CircleCheck, className: "bg-brand-50 text-brand-800 ring-brand-200" },
  conditional: { icon: Info, className: "bg-amber-50 text-amber-900 ring-amber-200" },
  residual: { icon: CircleAlert, className: "bg-canvas text-ink ring-line-strong" },
};

export default function WasteGuide({ classId }: { classId: WasteClassId }) {
  const info = WASTE_INFO[classId];
  const { icon: Icon, className } = RECYCLABILITY_STYLE[info.recyclability];

  return (
    <section aria-labelledby="waste-guide-heading" className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 id="waste-guide-heading" className="font-semibold text-ink">
          What should you do with it?
        </h4>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${className}`}
        >
          <Icon className="size-3.5" aria-hidden="true" />
          {info.recyclabilityLabel}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{info.summary}</p>
      <ul className="mt-3 space-y-2">
        {info.guidance.map((tip) => (
          <li key={tip} className="flex gap-2 text-sm leading-relaxed text-ink">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
            {tip}
          </li>
        ))}
      </ul>
      <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-ink-subtle">{LOCAL_RULES_NOTICE}</p>
    </section>
  );
}
