import { BrainCircuit, ChartBar, ImageUp, SlidersHorizontal, Tags } from "lucide-react";
import SectionHeading from "./SectionHeading";

const STEPS = [
  { icon: ImageUp, title: "Upload", text: "Select an existing waste image from your device." },
  {
    icon: SlidersHorizontal,
    title: "Prepare",
    text: "The image is resized to 224 × 224 pixels and converted into the exact format used during model training.",
  },
  { icon: BrainCircuit, title: "Analyze", text: "MobileNetV2 analyses visual patterns and features such as texture, shape and shine." },
  { icon: Tags, title: "Classify", text: "The trained neural network determines the most probable of the six waste categories." },
  { icon: ChartBar, title: "Result", text: "The predicted category, its confidence and the scores for every category are displayed." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="border-y border-line bg-surface py-16 sm:py-24">
      <div className="page-container">
        <SectionHeading
          id="how-heading"
          eyebrow="How it works"
          title="From photo to prediction in five steps"
          description="Everything after the upload happens on your device. The model runs directly in the browser, so the image never leaves your computer or phone."
        />
        <ol className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
          {STEPS.map(({ icon: Icon, title, text }, index) => (
            <li
              key={title}
              className="group card-interactive flex items-start gap-4 rounded-2xl border border-line bg-canvas p-5 hover:bg-surface sm:flex-col sm:gap-0 sm:last:col-span-2 lg:last:col-auto"
            >
              <div className="flex shrink-0 items-center justify-between sm:mb-4 sm:w-full">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700 transition-colors duration-200 group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span
                  className="hidden text-sm font-semibold text-ink-subtle tabular-nums transition-colors duration-200 group-hover:text-brand-700 sm:block"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="sm:w-full">
                <h3 className="font-semibold text-ink">
                  <span className="mr-1.5 text-ink-subtle tabular-nums sm:hidden">{String(index + 1).padStart(2, "0")}</span>
                  {title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
