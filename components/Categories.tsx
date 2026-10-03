import { WASTE_CLASS_IDS } from "@/lib/classes";
import { WASTE_INFO } from "@/lib/wasteData";
import CategoryIcon from "./CategoryIcon";
import SectionHeading from "./SectionHeading";

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
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {WASTE_CLASS_IDS.map((id) => {
            const info = WASTE_INFO[id];
            return (
              <li
                key={id}
                className="rounded-2xl border border-line bg-surface p-5 shadow-card transition-shadow duration-150 hover:shadow-raised"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <CategoryIcon classId={id} className="size-6" />
                </span>
                <h3 className="mt-4 font-semibold text-ink">{info.label}</h3>
                <p className="mt-1 text-sm leading-snug text-ink-muted">{info.examples}</p>
                <p className="mt-3 text-xs font-medium text-brand-800">{info.recyclabilityLabel}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
