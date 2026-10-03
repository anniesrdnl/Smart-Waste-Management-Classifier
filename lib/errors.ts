export type ClassifierErrorCode =
  | "no-file"
  | "empty-file"
  | "unsupported-format"
  | "file-too-large"
  | "decode-failed"
  | "heic-unsupported"
  | "unsupported-browser"
  | "model-missing"
  | "model-incompatible"
  | "model-load-failed"
  | "output-mismatch"
  | "prediction-failed";

export const ERROR_MESSAGES: Record<ClassifierErrorCode, { title: string; message: string }> = {
  "no-file": {
    title: "No image selected",
    message: "Choose a JPG, JPEG, PNG or WEBP image to continue.",
  },
  "empty-file": {
    title: "Empty file",
    message: "The selected file contains no data. Please choose a different image.",
  },
  "unsupported-format": {
    title: "Unsupported file format",
    message: "Only JPG, JPEG, PNG and WEBP images are supported.",
  },
  "file-too-large": {
    title: "File too large",
    message: "Images must be 20 MB or smaller. Try a smaller or compressed version of the photo.",
  },
  "decode-failed": {
    title: "Image could not be read",
    message: "The file may be corrupted or is not a valid image. Please try a different file.",
  },
  "heic-unsupported": {
    title: "HEIC photos are not supported in this browser",
    message:
      "This browser cannot read HEIC/HEIF photos (the default format on iPhones). Save or export the photo as JPG or PNG, then upload it again.",
  },
  "unsupported-browser": {
    title: "Browser not supported",
    message:
      "Your browser does not support the features needed to run the model locally. Please use a recent version of Chrome, Edge, Firefox or Safari.",
  },
  "model-missing": {
    title: "Trained model not added yet",
    message:
      "The classifier interface is ready, but the trained MobileNetV2 model files have not been deployed. Classification is unavailable until they are added.",
  },
  "model-incompatible": {
    title: "Model configuration mismatch",
    message: "The deployed model files do not match what this application expects, so classification has been disabled.",
  },
  "model-load-failed": {
    title: "Model failed to load",
    message: "The classification model could not be loaded. Check your connection and try again.",
  },
  "output-mismatch": {
    title: "Unexpected model output",
    message: "The model returned results in an unexpected format, so no prediction is shown.",
  },
  "prediction-failed": {
    title: "Classification failed",
    message: "Something went wrong while analysing the image. Please try again.",
  },
};

export class ClassifierError extends Error {
  readonly code: ClassifierErrorCode;

  constructor(code: ClassifierErrorCode, detail?: string, options?: { cause?: unknown }) {
    super(detail ?? ERROR_MESSAGES[code].message, options);
    this.name = "ClassifierError";
    this.code = code;
  }
}

const USER_INPUT_ERRORS: ReadonlySet<ClassifierErrorCode> = new Set([
  "no-file",
  "empty-file",
  "unsupported-format",
  "file-too-large",
  "decode-failed",
  "heic-unsupported",
]);

export function toClassifierError(error: unknown, fallback: ClassifierErrorCode): ClassifierError {
  const classified = error instanceof ClassifierError ? error : new ClassifierError(fallback, undefined, { cause: error });
  const hasDetail = classified.cause !== undefined || classified.message !== ERROR_MESSAGES[classified.code].message;
  if (hasDetail && !USER_INPUT_ERRORS.has(classified.code)) console.error(classified);
  return classified;
}
