import { WASTE_CLASS_IDS } from "@/lib/classes";
import { WASTE_INFO, type Recyclability } from "@/lib/wasteData";
import CategoryIcon from "./CategoryIcon";
import SectionHeading from "./SectionHeading";

const BADGE_DOT: Record<Recyclability, string> = {
  recyclable: "bg-brand-500",
  conditional: "bg-amber-500",
  residual: "bg-ink-subtle",
};

export default function Categories() {
  return (
    <section id="categories" aria-labelledby="categories-heading" className="border-t border-line bg-surface py-16 sm:py-20 lg:py-24">
      <div className="page-container">
        <SectionHeading
          id="categories-heading"
          eyebrow="Waste Categories"
          title="Six materials the model recognises"
          description="Every image is assigned to the closest of these six categories, so photos of other objects will still receive one of them."
        />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:mt-12 lg:grid-cols-3 xl:grid-cols-6">
          {WASTE_CLASS_IDS.map((id) => {
            const info = WASTE_INFO[id];
            return (
              <li
                key={id}
                id={`category-${id}`}
                className="group card-interactive flex scroll-mt-24 gap-4 rounded-2xl border border-line bg-canvas p-5 hover:bg-surface target:border-brand-300 target:bg-brand-50/60 target:ring-2 target:ring-brand-200 sm:flex-col sm:gap-0"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface text-brand-700 ring-1 ring-line transition-colors duration-200 group-hover:bg-brand-600 group-hover:text-white group-hover:ring-brand-600 group-target:bg-brand-600 group-target:text-white">
                  <CategoryIcon classId={id} className="size-5" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col sm:mt-5">
                  <h3 className="font-semibold text-ink">{info.label}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted sm:mb-5">{info.description}</p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted sm:mt-auto sm:border-t sm:border-line sm:pt-4">
                    <span className={`size-1.5 shrink-0 rounded-full ${BADGE_DOT[info.recyclability]}`} aria-hidden="true" />
                    {info.recyclabilityLabel}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
