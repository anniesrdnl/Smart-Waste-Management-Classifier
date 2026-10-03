import { ShieldCheck } from "lucide-react";

export default function ResponsibleAI() {
  return (
    <section aria-labelledby="responsible-ai-heading" className="bg-surface pb-16 sm:pb-24">
      <div className="page-container">
        <div className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-6">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-800 ring-1 ring-amber-200">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="responsible-ai-heading" className="font-semibold text-amber-950">
              Use results as guidance, not as a final rule
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-amber-950/80">
              AI predictions may not always be correct. Results depend on image quality, lighting, object visibility, and
              the model&apos;s training data. SmartWaste does not replace official guidance, so always check your local
              waste-disposal rules when in doubt.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
