import { Recycle } from "lucide-react";

const DATASET_LINK =
  "font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 transition-colors duration-150 hover:text-brand-800 hover:decoration-brand-700";

const LINKS = [
  { href: "#classifier", label: "Classifier" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#categories", label: "Categories" },
  { href: "#about", label: "About" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="page-container py-10 sm:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <a href="#home" className="group inline-flex items-center gap-2 rounded-lg font-semibold text-ink">
              <span className="flex size-7 items-center justify-center rounded-lg bg-brand-600 text-white transition-transform duration-200 group-hover:rotate-[-8deg]">
                <Recycle className="size-4" aria-hidden="true" />
              </span>
              Smart Waste
            </a>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Waste image classification with MobileNetV2 transfer learning, running entirely in your browser.
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-1 gap-y-1 text-sm">
              {LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="rounded-lg px-3 py-2 text-ink-muted transition-colors duration-150 hover:bg-line/50 hover:text-ink active:bg-line"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-line pt-6 text-xs leading-relaxed text-ink-subtle sm:flex-row sm:justify-between sm:gap-6">
          <p>
            Trained on{" "}
            <a href="https://github.com/garythung/trashnet" className={DATASET_LINK} target="_blank" rel="noopener noreferrer">
              TrashNet
            </a>{" "}
            (Thung &amp; Yang) and{" "}
            <a
              href="https://archive.ics.uci.edu/dataset/908/realwaste"
              className={DATASET_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              RealWaste
            </a>{" "}
            (Single, Iranmanesh &amp; Raad, CC BY 4.0).
          </p>
          <p>Disposal guidance is general — check your local waste authority.</p>
        </div>
      </div>
    </footer>
  );
}
