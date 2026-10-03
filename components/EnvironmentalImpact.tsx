import { Lightbulb, Recycle, Sprout } from "lucide-react";
import SectionHeading from "./SectionHeading";

const BENEFITS = [
  {
    icon: Recycle,
    title: "Cleaner recycling streams",
    text: "Putting items in the right bin reduces contamination, which can make recyclable material harder to process.",
  },
  {
    icon: Sprout,
    title: "Better everyday habits",
    text: "Quick, consistent feedback helps people learn to recognise materials and sort them with confidence.",
  },
  {
    icon: Lightbulb,
    title: "Informed decisions",
    text: "Handling tips explain why some items need rinsing, separating or a special collection point.",
  },
];

export default function EnvironmentalImpact() {
  return (
    <section aria-labelledby="impact-heading" className="border-t border-line py-16 sm:py-24">
      <div className="page-container grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <SectionHeading
          id="impact-heading"
          eyebrow="Why It Matters"
          title="Better sorting starts with knowing what you hold"
          description="Recycling works best when materials are separated correctly. Identifying an item before you throw it away is a small step that supports more responsible waste habits."
        />
        <ul className="grid gap-3 sm:gap-4">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="group card-interactive flex gap-4 rounded-2xl border border-line bg-surface p-5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors duration-200 group-hover:bg-brand-600 group-hover:text-white">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-ink">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
