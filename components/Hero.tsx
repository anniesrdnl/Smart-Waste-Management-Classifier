import { ArrowRight } from "lucide-react";
import HeroVisual from "./HeroVisual";

export default function Hero() {
  return (
    <section id="home" aria-labelledby="hero-heading" className="border-b border-line bg-surface pt-19">
      <div className="page-container grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800">
            <span className="size-1.5 rounded-full bg-brand-500" aria-hidden="true" />
            AI-Powered Waste Classification
          </p>
          <h1 id="hero-heading" className="mt-5 text-4xl font-bold tracking-tight text-ink sm:text-5xl sm:leading-[1.08]">
            Sort Smarter.
            <br />
            <span className="text-brand-700">Waste Better.</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-muted">
            Use computer vision to quickly identify common waste materials and receive guidance on how they should be
            handled.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
          <p className="mt-6 text-sm text-ink-subtle">
            Upload a photo · Get a prediction · Know what to do next
          </p>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
