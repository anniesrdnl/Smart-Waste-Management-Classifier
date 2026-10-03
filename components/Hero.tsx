import { ArrowRight, BrainCircuit, ImageUp, Tags } from "lucide-react";
import { WASTE_CLASS_IDS } from "@/lib/classes";
import { WASTE_INFO } from "@/lib/wasteData";
import CategoryIcon from "./CategoryIcon";

const PIPELINE = [
  { icon: ImageUp, title: "Your image", detail: "Resized to 224 × 224 RGB" },
  { icon: BrainCircuit, title: "MobileNetV2", detail: "ImageNet-pretrained, fine-tuned on waste images" },
  { icon: Tags, title: "Six categories", detail: "Probabilities for every class" },
];

export default function Hero() {
  return (
    <section id="home" aria-labelledby="hero-heading" className="border-b border-line bg-surface">
      <div className="page-container grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800">
            <span className="size-1.5 rounded-full bg-brand-500" aria-hidden="true" />
            Computer vision · Transfer learning
          </p>
          <h1 id="hero-heading" className="mt-5 text-4xl font-bold tracking-tight text-ink sm:text-5xl sm:leading-[1.1]">
            Identify Waste.
            <br />
            <span className="text-brand-700">Dispose Smarter.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
            Smart Waste uses computer vision and transfer learning to recognise common waste materials from a photo, then
            offers general guidance on how to dispose of them.
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
        </div>

        <div className="rounded-3xl border border-line bg-canvas p-4 shadow-card sm:p-5">
          <ol className="space-y-2.5">
            {PIPELINE.map(({ icon: Icon, title, detail }, index) => (
              <li
                key={title}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition-colors duration-200 hover:border-brand-200"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors duration-200 group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-ink-subtle">Step {index + 1}</p>
                  <p className="font-semibold text-ink">{title}</p>
                  <p className="text-sm text-ink-muted">{detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <ul className="mt-2.5 grid grid-cols-3 gap-2 sm:grid-cols-6" aria-label="Supported categories">
            {WASTE_CLASS_IDS.map((id) => (
              <li
                key={id}
                className="group flex flex-col items-center gap-1.5 rounded-xl border border-line bg-surface px-1 py-2.5 text-xs font-medium text-ink-muted transition-colors duration-200 hover:border-brand-200 hover:text-brand-800"
              >
                <CategoryIcon
                  classId={id}
                  className="size-4.5 text-brand-700 transition-transform duration-200 group-hover:-translate-y-0.5"
                />
                {WASTE_INFO[id].label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
