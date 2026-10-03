import type { WasteClassId } from "@/lib/classes";
import type { ClassifierError } from "@/lib/errors";

export interface ClassProbability {
  classId: WasteClassId;
  probability: number;
}

export interface Prediction {
  classId: WasteClassId;
  confidence: number;
  probabilities: ClassProbability[];
  inferenceMs: number;
}

export interface ModelInput {
  name: string;
  height: number;
  width: number;
  channels: number;
}

export interface ModelMetrics {
  testAccuracy: number;
  testLoss: number;
  macroPrecision: number;
  macroRecall: number;
  macroF1: number;
  testSamples: number;
}

export interface DatasetSplit {
  train: number;
  validation: number;
  test: number;
}

export interface ModelMetadata {
  modelVersion: string;
  modelFile: string;
  input: ModelInput;
  outputName: string;
  classNames: WasteClassId[];
  datasetName: string;
  datasetSplit: DatasetSplit | null;
  metrics: ModelMetrics | null;
}

export type ModelStatus = "idle" | "loading" | "ready" | "error";

export interface ModelState {
  status: ModelStatus;
  error: ClassifierError | null;
}

export interface SelectedImage {
  file: File;
  previewUrl: string;
  bitmap: ImageBitmap;
}
