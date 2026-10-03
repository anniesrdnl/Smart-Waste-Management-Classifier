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
    <section id="categories" aria-labelledby="categories-heading" className="py-16 sm:py-24">
      <div className="page-container">
        <SectionHeading
          id="categories-heading"
          eyebrow="Supported categories"
          title="Six common waste materials"
          description="The model was trained to recognise these six categories. Images of other objects will still be assigned to the closest of the six."
        />
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {WASTE_CLASS_IDS.map((id) => {
            const info = WASTE_INFO[id];
            return (
              <li
                key={id}
                className="group card-interactive flex flex-col rounded-2xl border border-line bg-surface p-4 shadow-card sm:p-5"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors duration-200 group-hover:bg-brand-600 group-hover:text-white">
                  <CategoryIcon classId={id} className="size-5.5" />
                </span>
                <h3 className="mt-4 font-semibold text-ink">{info.label}</h3>
                <p className="mt-1 text-sm leading-snug text-ink-muted">{info.examples}</p>
                <p className="mt-auto flex items-start gap-1.5 pt-4 text-xs leading-4 font-medium text-ink-muted">
                  <span className={`mt-[5px] size-1.5 shrink-0 rounded-full ${BADGE_DOT[info.recyclability]}`} aria-hidden="true" />
                  {info.recyclabilityLabel}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
