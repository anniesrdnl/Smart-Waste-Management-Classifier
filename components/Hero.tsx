import { ArrowRight } from "lucide-react";
import HeroVisual from "./HeroVisual";

const FACTS = [
  { label: "Recognises", value: "6 materials" },
  { label: "Runs", value: "On your device" },
  { label: "Model", value: "MobileNetV2" },
];

export default function Hero() {
  return (
    <section id="home" aria-labelledby="hero-heading" className="border-b border-line bg-surface">
      <div className="page-container grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16 lg:py-20 xl:gap-24">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800">
            <span className="size-1.5 rounded-full bg-brand-500" aria-hidden="true" />
            AI-Powered Waste Classification
          </p>
          <h1
            id="hero-heading"
            className="mt-6 text-4xl font-bold tracking-tight text-ink sm:text-5xl sm:leading-[1.05] xl:text-[3.75rem]"
          >
            Sort Smarter.
            <br />
            <span className="text-brand-700">Waste Better.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-muted">
            Use computer vision to quickly identify common waste materials and receive guidance on how they should be
            handled.
          </p>
          <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
            <a href="#classifier" className="group btn btn-primary px-6 py-3">
              Classify Waste
              <ArrowRight
                className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
            <a href="#how-it-works" className="btn btn-secondary px-6 py-3">
              How It Works
            </a>
          </div>

          <dl className="mt-12 grid grid-cols-3 border-t border-line pt-6">
            {FACTS.map(({ label, value }) => (
              <div key={label} className="border-l border-line px-3 first:border-l-0 first:pl-0 sm:px-5">
                <dt className="text-xs text-ink-subtle">{label}</dt>
                <dd className="mt-1 text-sm font-semibold text-ink sm:text-base">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
