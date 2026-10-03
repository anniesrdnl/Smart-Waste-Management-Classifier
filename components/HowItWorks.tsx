import { BrainCircuit, ImageUp, Tags } from "lucide-react";
import SectionHeading from "./SectionHeading";

const STEPS = [
  { icon: ImageUp, title: "Upload", text: "Upload a clear photo of the waste item." },
  {
    icon: BrainCircuit,
    title: "AI Analysis",
    text: "The computer vision model analyzes the visual characteristics of the image.",
  },
  {
    icon: Tags,
    title: "Classification",
    text: "The system predicts the waste category and displays disposal guidance.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="border-t border-line py-16 sm:py-20 lg:py-24">
      <div className="page-container">
        <SectionHeading
          id="how-heading"
          eyebrow="How It Works"
          title="From photo to guidance in three steps"
          description="No account and no waiting. The whole process runs in your browser."
        />
        <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6 lg:mt-14">
          {STEPS.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="group relative flex gap-5 md:flex-col md:gap-0">
              {index < STEPS.length - 1 && (
                <span
                  className="absolute top-15 -bottom-5 left-6 w-px bg-brand-200 md:top-6 md:right-[-0.75rem] md:bottom-auto md:left-[3.75rem] md:h-px md:w-auto"
                  aria-hidden="true"
                />
              )}
              <span className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl border border-brand-200 bg-surface text-brand-700 shadow-card transition-colors duration-200 group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-white">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="pt-1 md:mt-6 md:max-w-sm md:pt-0 md:pr-6">
                <p className="text-xs font-semibold tracking-wide text-brand-700 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
