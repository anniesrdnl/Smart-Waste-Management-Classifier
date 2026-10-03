import { Lightbulb, Recycle, Sprout } from "lucide-react";

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
    <section aria-labelledby="impact-heading" className="bg-ink py-16 text-white sm:py-20 lg:py-24">
      <div className="page-container grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
        <div className="max-w-md">
          <p className="text-sm font-semibold tracking-wide text-brand-300 uppercase">Why It Matters</p>
          <h2 id="impact-heading" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-[2.125rem]">
            Better sorting starts with knowing what you hold
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            Recycling works best when materials are separated correctly. Identifying an item before you throw it away is
            a small step that supports more responsible waste habits.
          </p>
        </div>
        <ul className="grid gap-px self-end overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10 sm:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="group bg-ink p-6 transition-colors duration-200 hover:bg-[#232724] lg:p-7">
              <span className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-brand-300 ring-1 ring-white/10 transition-colors duration-200 group-hover:bg-brand-600 group-hover:text-white group-hover:ring-brand-600">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/65">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
