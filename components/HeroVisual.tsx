"use client";

import { useState } from "react";
import { WASTE_CLASS_IDS, type WasteClassId } from "@/lib/classes";
import { WASTE_INFO } from "@/lib/wasteData";
import CategoryIcon from "./CategoryIcon";

const DEFAULT_CATEGORY: WasteClassId = "plastic";

function Corner({ className }: { className: string }) {
  return <span className={`absolute size-5 border-brand-600 ${className}`} aria-hidden="true" />;
}

export default function HeroVisual() {
  const [active, setActive] = useState<WasteClassId>(DEFAULT_CATEGORY);

  return (
    <figure className="relative rounded-3xl border border-line bg-canvas p-3 shadow-raised sm:p-4">
      <div className="flex items-center justify-between px-1.5 pb-3 text-xs text-ink-subtle">
        <span className="font-medium">Image analysis</span>
        <span>MobileNetV2 · 224 × 224</span>
      </div>

      <div
        className="bg-grid relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-line bg-surface sm:aspect-[16/10]"
        role="img"
        aria-label={`Illustration of the classifier recognising ${WASTE_INFO[active].label.toLowerCase()}`}
      >
        <div className="relative mt-6 flex h-[60%] w-[40%] items-center justify-center">
          <Corner className="top-0 left-0 rounded-tl-lg border-t-2 border-l-2" />
          <Corner className="top-0 right-0 rounded-tr-lg border-t-2 border-r-2" />
          <Corner className="bottom-0 left-0 rounded-bl-lg border-b-2 border-l-2" />
          <Corner className="right-0 bottom-0 rounded-br-lg border-r-2 border-b-2" />

          <span
            className="absolute inset-x-2 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-70 [animation-duration:2.4s] motion-safe:animate-sweep"
            aria-hidden="true"
          />

          <span key={active} className="flex size-[72%] items-center justify-center motion-safe:animate-fade-up">
            <CategoryIcon classId={active} className="size-full text-ink/80" strokeWidth={0.9} />
          </span>

          <span className="absolute -top-8 left-0 inline-flex items-center gap-1.5 rounded-md bg-brand-600 px-2 py-1 text-[11px] font-semibold text-white shadow-sm">
            <CategoryIcon classId={active} className="size-3" />
            {WASTE_INFO[active].label}
          </span>
        </div>
      </div>

      <figcaption className="sr-only">The six waste categories. Select one to learn how to handle it.</figcaption>
      <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6" onMouseLeave={() => setActive(DEFAULT_CATEGORY)}>
        {WASTE_CLASS_IDS.map((id) => {
          const selected = id === active;
          return (
            <li key={id}>
              <a
                href={`#category-${id}`}
                onMouseEnter={() => setActive(id)}
                onFocus={() => setActive(id)}
                aria-label={`Learn about ${WASTE_INFO[id].label}`}
                className={`group flex flex-col items-center gap-1.5 rounded-xl border px-1 py-2.5 text-xs font-medium transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.97] ${
                  selected
                    ? "border-brand-300 bg-brand-50 text-brand-800"
                    : "border-line bg-surface text-ink-muted hover:border-brand-200 hover:text-ink"
                }`}
              >
                <CategoryIcon
                  classId={id}
                  className={`size-4.5 transition-colors duration-150 ${selected ? "text-brand-700" : "text-ink-subtle group-hover:text-brand-700"}`}
                />
                {WASTE_INFO[id].label}
              </a>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
