import { Info, TriangleAlert, X } from "lucide-react";
import { ERROR_MESSAGES, type ClassifierError, type ClassifierErrorCode } from "@/lib/errors";

const INFORMATIONAL_CODES: ReadonlySet<ClassifierErrorCode> = new Set(["model-missing"]);

const TONES = {
  error: {
    container: "border-red-200 bg-red-50 text-red-900",
    icon: "text-red-700",
    button: "border-red-300 text-red-800 hover:bg-red-100",
    dismiss: "text-red-800 hover:bg-red-100",
  },
  info: {
    container: "border-amber-200 bg-amber-50 text-amber-950",
    icon: "text-amber-700",
    button: "border-amber-300 text-amber-900 hover:bg-amber-100",
    dismiss: "text-amber-900 hover:bg-amber-100",
  },
};

interface ErrorAlertProps {
  error: ClassifierError;
  onDismiss?: () => void;
  action?: { label: string; onClick: () => void };
}

export default function ErrorAlert({ error, onDismiss, action }: ErrorAlertProps) {
  const { title, message } = ERROR_MESSAGES[error.code];
  const informational = INFORMATIONAL_CODES.has(error.code);
  const tone = TONES[informational ? "info" : "error"];
  const Icon = informational ? Info : TriangleAlert;
  return (
    <div role={informational ? "status" : "alert"} className={`flex gap-3 rounded-xl border p-4 ${tone.container}`}>
      <Icon className={`mt-0.5 size-5 shrink-0 ${tone.icon}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-relaxed">{message}</p>
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className={`mt-3 rounded-lg border bg-white px-3 py-1.5 text-sm font-semibold transition-colors duration-150 active:scale-[0.98] ${tone.button}`}
          >
            {action.label}
          </button>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss message"
          className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 ${tone.dismiss}`}
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
