import { Milk } from "lucide-react";
import { WASTE_CLASS_IDS } from "@/lib/classes";
import { WASTE_INFO } from "@/lib/wasteData";
import CategoryIcon from "./CategoryIcon";

const HIGHLIGHTED = "plastic";

function Corner({ className }: { className: string }) {
  return <span className={`absolute size-5 border-brand-600 ${className}`} aria-hidden="true" />;
}

export default function HeroVisual() {
  return (
    <figure
      className="relative rounded-3xl border border-line bg-canvas p-4 shadow-card sm:p-5"
      aria-label="Illustration: the classifier recognising a plastic bottle and mapping it to one of six waste categories"
    >
      <div className="flex items-center justify-between px-1 pb-3 text-xs text-ink-subtle">
        <span className="font-medium">Image analysis</span>
        <span>MobileNetV2 · 224 × 224</span>
      </div>

      <div className="bg-grid relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="relative mt-6 flex h-[62%] w-[46%] items-center justify-center">
          <Corner className="top-0 left-0 rounded-tl-lg border-t-2 border-l-2" />
          <Corner className="top-0 right-0 rounded-tr-lg border-t-2 border-r-2" />
          <Corner className="bottom-0 left-0 rounded-bl-lg border-b-2 border-l-2" />
          <Corner className="right-0 bottom-0 rounded-br-lg border-r-2 border-b-2" />

          <span
            className="absolute inset-x-2 top-2 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-70 motion-safe:animate-scan [--scan-distance:11rem] sm:[--scan-distance:14rem]"
            aria-hidden="true"
          />

          <Milk className="size-[72%] text-ink/80" strokeWidth={0.9} aria-hidden="true" />

          <span className="absolute -top-8 left-0 inline-flex items-center gap-1.5 rounded-md bg-brand-600 px-2 py-1 text-[11px] font-semibold text-white shadow-sm">
            <CategoryIcon classId={HIGHLIGHTED} className="size-3" />
            {WASTE_INFO[HIGHLIGHTED].label}
          </span>
        </div>
      </div>

      <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6" aria-hidden="true">
        {WASTE_CLASS_IDS.map((id) => {
          const active = id === HIGHLIGHTED;
          return (
            <li
              key={id}
              className={`flex flex-col items-center gap-1.5 rounded-xl border px-1 py-2.5 text-xs font-medium ${
                active ? "border-brand-300 bg-brand-50 text-brand-800" : "border-line bg-surface text-ink-muted"
              }`}
            >
              <CategoryIcon classId={id} className={`size-4.5 ${active ? "text-brand-700" : "text-ink-subtle"}`} />
              {WASTE_INFO[id].label}
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
