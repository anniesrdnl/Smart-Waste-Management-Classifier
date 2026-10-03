import { Recycle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="page-container flex flex-col gap-6 py-10 text-sm text-ink-muted md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <p className="flex items-center gap-2 font-bold text-ink">
            <Recycle className="size-4 text-brand-700" aria-hidden="true" />
            Smart Waste
          </p>
          <p className="mt-2 leading-relaxed">
            A computer vision project: waste image classification with MobileNetV2 transfer learning, running entirely in
            the browser.
          </p>
        </div>
        <div className="max-w-md space-y-2 leading-relaxed">
          <p>
            Trained on the{" "}
            <a
              href="https://github.com/garythung/trashnet"
              className="font-medium text-brand-700 underline underline-offset-2 hover:text-brand-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              TrashNet dataset
            </a>{" "}
            by Gary Thung and Mindy Yang.
          </p>
          <p className="text-xs text-ink-subtle">
            Disposal guidance is general. Recycling rules differ between locations — check your local waste authority.
          </p>
        </div>
      </div>
    </footer>
  );
}
