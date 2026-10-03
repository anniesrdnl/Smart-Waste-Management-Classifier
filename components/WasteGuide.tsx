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
    <section
      aria-labelledby="waste-guide-heading"
      className="grid gap-5 rounded-[1.25rem] border border-line bg-canvas p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-12"
    >
      <div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${className}`}
        >
          <Icon className="size-3.5" aria-hidden="true" />
          {info.recyclabilityLabel}
        </span>
        <h4 id="waste-guide-heading" className="mt-3 text-lg font-semibold text-ink">
          What should you do with it?
        </h4>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{info.summary}</p>
        <p className="mt-4 text-xs leading-relaxed text-ink-subtle">{LOCAL_RULES_NOTICE}</p>
      </div>
      <ol className="divide-y divide-line self-center rounded-xl border border-line bg-surface">
        {info.guidance.map((tip, index) => (
          <li key={tip} className="flex gap-3.5 px-4 py-3.5 text-sm leading-relaxed text-ink">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
              {index + 1}
            </span>
            <span className="pt-0.5">{tip}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
