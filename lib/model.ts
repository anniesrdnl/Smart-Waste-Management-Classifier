import type * as Ort from "onnxruntime-web";
import type { ClassProbability, ModelMetadata, ModelMetrics, Prediction } from "@/types/prediction";
import { WASTE_CLASS_IDS, isWasteClassId } from "./classes";
import { ClassifierError, toClassifierError } from "./errors";
import { imageToModelInput } from "./preprocess";

const MODEL_BASE_PATH = "/model/";
const METADATA_PATH = `${MODEL_BASE_PATH}metadata.json`;
const ORT_BASE_PATH = "/ort/";
const ORT_MODULE_FILE = "ort.wasm.min.mjs";
const PROBABILITY_SUM_TOLERANCE = 1e-3;

type OrtModule = typeof Ort;

export interface WasteClassifierModel {
  metadata: ModelMetadata;
  classify(image: ImageBitmap): Promise<Prediction>;
}

let metadataPromise: Promise<ModelMetadata> | null = null;
let classifierPromise: Promise<WasteClassifierModel> | null = null;

function cachedOrRetry<T>(create: () => Promise<T>, store: (value: Promise<T> | null) => void): Promise<T> {
  const promise = create().catch((error: unknown) => {
    store(null);
    throw error;
  });
  store(promise);
  return promise;
}

export function loadModelMetadata(): Promise<ModelMetadata> {
  return metadataPromise ?? cachedOrRetry(fetchMetadata, (value) => (metadataPromise = value));
}

export function loadClassifier(): Promise<WasteClassifierModel> {
  return classifierPromise ?? cachedOrRetry(createClassifier, (value) => (classifierPromise = value));
}

async function fetchMetadata(): Promise<ModelMetadata> {
  let response: Response;
  try {
    response = await fetch(METADATA_PATH, { cache: "no-cache" });
  } catch (error) {
    throw new ClassifierError("model-load-failed", undefined, { cause: error });
  }
  if (response.status === 404) throw new ClassifierError("model-missing");
  if (!response.ok) throw new ClassifierError("model-load-failed", `Metadata request failed with HTTP ${response.status}`);

  let raw: unknown;
  try {
    raw = await response.json();
  } catch (error) {
    throw new ClassifierError("model-incompatible", "metadata.json is not valid JSON", { cause: error });
  }
  return parseMetadata(raw);
}

function asRecord(value: unknown, field: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new ClassifierError("model-incompatible", `metadata.${field} must be an object`);
  }
  return value as Record<string, unknown>;
}

function expect(condition: boolean, detail: string): asserts condition {
  if (!condition) throw new ClassifierError("model-incompatible", detail);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function parseMetrics(value: unknown): ModelMetrics | null {
  if (value === null || value === undefined) return null;
  const metrics = asRecord(value, "metrics");
  const parsed = {
    testAccuracy: metrics.test_accuracy,
    testLoss: metrics.test_loss,
    macroPrecision: metrics.macro_precision,
    macroRecall: metrics.macro_recall,
    macroF1: metrics.macro_f1,
    testSamples: metrics.test_samples,
  };
  expect(Object.values(parsed).every(isFiniteNumber), "metadata.metrics contains a non-numeric value");
  return parsed as ModelMetrics;
}

function parseMetadata(raw: unknown): ModelMetadata {
  const root = asRecord(raw, "root");
  const input = asRecord(root.input, "input");
  const output = asRecord(root.output, "output");
  const preprocessing = asRecord(root.preprocessing, "preprocessing");
  const dataset = asRecord(root.dataset, "dataset");

  const classNames = root.class_names;
  expect(Array.isArray(classNames), "metadata.class_names must be an array");
  expect(
    classNames.length === WASTE_CLASS_IDS.length &&
      classNames.every(isWasteClassId) &&
      new Set(classNames).size === WASTE_CLASS_IDS.length,
    `metadata.class_names must contain each of: ${WASTE_CLASS_IDS.join(", ")}`,
  );

  expect(typeof root.model_file === "string" && /^[\w.-]+\.onnx$/.test(root.model_file), "metadata.model_file is invalid");
  expect(typeof input.name === "string" && input.name.length > 0, "metadata.input.name is missing");
  expect(typeof output.name === "string" && output.name.length > 0, "metadata.output.name is missing");
  expect(isFiniteNumber(input.height) && isFiniteNumber(input.width), "metadata.input size is missing");
  expect(input.channels === 3, "metadata.input.channels must be 3");
  expect(input.layout === "NHWC", "metadata.input.layout must be NHWC");
  expect(input.color_order === "RGB", "metadata.input.color_order must be RGB");
  expect(
    Array.isArray(input.pixel_range) && input.pixel_range[0] === 0 && input.pixel_range[1] === 255,
    "metadata.input.pixel_range must be [0, 255]",
  );
  expect(preprocessing.embedded_in_model === true, "MobileNetV2 preprocessing must be embedded in the model");
  expect(output.activation === "softmax", "metadata.output.activation must be softmax");

  const split = dataset.split === undefined ? null : asRecord(dataset.split, "dataset.split");

  return {
    modelVersion: typeof root.model_version === "string" ? root.model_version : "unknown",
    modelFile: root.model_file,
    input: { name: input.name, height: input.height, width: input.width, channels: input.channels },
    outputName: output.name,
    classNames,
    datasetName: typeof dataset.name === "string" ? dataset.name : "Unknown",
    datasetSplit:
      split && isFiniteNumber(split.train) && isFiniteNumber(split.validation) && isFiniteNumber(split.test)
        ? { train: split.train, validation: split.validation, test: split.test }
        : null,
    metrics: parseMetrics(root.metrics),
  };
}

function assertBrowserSupport(): void {
  const supported =
    typeof window !== "undefined" &&
    typeof WebAssembly === "object" &&
    typeof createImageBitmap === "function" &&
    typeof document.createElement("canvas").getContext === "function";
  if (!supported) throw new ClassifierError("unsupported-browser");
}

async function importOrt(): Promise<OrtModule> {
  const baseUrl = new URL(ORT_BASE_PATH, window.location.origin).href;
  let ort: OrtModule;
  try {
    ort = (await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ `${baseUrl}${ORT_MODULE_FILE}`)) as OrtModule;
  } catch (error) {
    throw new ClassifierError("model-load-failed", "ONNX Runtime could not be loaded", { cause: error });
  }
  ort.env.wasm.wasmPaths = baseUrl;
  ort.env.wasm.numThreads = 1;
  ort.env.logLevel = "error";
  return ort;
}

async function fetchModel(fileName: string): Promise<ArrayBuffer> {
  let response: Response;
  try {
    response = await fetch(`${MODEL_BASE_PATH}${fileName}`);
  } catch (error) {
    throw new ClassifierError("model-load-failed", undefined, { cause: error });
  }
  if (response.status === 404) throw new ClassifierError("model-missing", `${fileName} was not found`);
  if (!response.ok) throw new ClassifierError("model-load-failed", `Model request failed with HTTP ${response.status}`);
  return response.arrayBuffer();
}

function toPrediction(scores: Float32Array, metadata: ModelMetadata, inferenceMs: number): Prediction {
  if (scores.length !== metadata.classNames.length) {
    throw new ClassifierError(
      "output-mismatch",
      `Model returned ${scores.length} scores for ${metadata.classNames.length} classes`,
    );
  }
  const sum = scores.reduce((total, value) => total + value, 0);
  if (!scores.every((value) => Number.isFinite(value) && value >= 0) || Math.abs(sum - 1) > PROBABILITY_SUM_TOLERANCE) {
    throw new ClassifierError("output-mismatch", "Model output is not a softmax probability distribution");
  }

  const probabilities: ClassProbability[] = metadata.classNames
    .map((classId, index) => ({ classId, probability: scores[index] }))
    .sort((a, b) => b.probability - a.probability);

  return {
    classId: probabilities[0].classId,
    confidence: probabilities[0].probability,
    probabilities,
    inferenceMs,
  };
}

async function createClassifier(): Promise<WasteClassifierModel> {
  assertBrowserSupport();
  const metadata = await loadModelMetadata();
  const [ort, modelBuffer] = await Promise.all([importOrt(), fetchModel(metadata.modelFile)]);

  let session: Ort.InferenceSession;
  try {
    session = await ort.InferenceSession.create(modelBuffer, {
      executionProviders: ["wasm"],
      graphOptimizationLevel: "all",
    });
  } catch (error) {
    throw new ClassifierError("model-load-failed", "ONNX session could not be created", { cause: error });
  }

  if (!session.inputNames.includes(metadata.input.name) || !session.outputNames.includes(metadata.outputName)) {
    throw new ClassifierError(
      "model-incompatible",
      `Model graph exposes inputs [${session.inputNames.join(", ")}] and outputs [${session.outputNames.join(", ")}]`,
    );
  }

  const { name: inputName, height, width, channels } = metadata.input;

  return {
    metadata,
    async classify(image) {
      try {
        const pixels = imageToModelInput(image, width, height);
        const tensor = new ort.Tensor("float32", pixels, [1, height, width, channels]);
        const startedAt = performance.now();
        const outputs = await session.run({ [inputName]: tensor });
        const inferenceMs = performance.now() - startedAt;
        const output = outputs[metadata.outputName];
        if (!(output?.data instanceof Float32Array)) {
          throw new ClassifierError("output-mismatch", "Model output is not a float32 tensor");
        }
        return toPrediction(output.data, metadata, inferenceMs);
      } catch (error) {
        throw toClassifierError(error, "prediction-failed");
      }
    },
  };
}
