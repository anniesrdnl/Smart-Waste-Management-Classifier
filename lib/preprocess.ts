import { ClassifierError } from "./errors";

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

const SUPPORTED_FORMATS: Record<string, readonly string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

const MIME_ALIASES: Record<string, string> = {
  "image/jpg": "image/jpeg",
  "image/pjpeg": "image/jpeg",
  "image/x-png": "image/png",
};

const HEIC_TYPES = ["image/heic", "image/heif", "image/heic-sequence", "image/heif-sequence"];
const HEIC_EXTENSIONS = [".heic", ".heif"];

const SUPPORTED_EXTENSIONS = Object.values(SUPPORTED_FORMATS).flat();

export const FILE_INPUT_ACCEPT = [...Object.keys(SUPPORTED_FORMATS), ...SUPPORTED_EXTENSIONS, ...HEIC_EXTENSIONS].join(",");

function fileExtension(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot).toLowerCase();
}

function isHeic(file: File): boolean {
  return HEIC_TYPES.includes(file.type) || HEIC_EXTENSIONS.includes(fileExtension(file.name));
}

export function validateImageFile(file: File | null | undefined): asserts file is File {
  if (!file) throw new ClassifierError("no-file");

  const typeAllowed = (MIME_ALIASES[file.type] ?? file.type) in SUPPORTED_FORMATS;
  const extensionAllowed = SUPPORTED_EXTENSIONS.includes(fileExtension(file.name));
  if (!typeAllowed && !extensionAllowed && !isHeic(file)) throw new ClassifierError("unsupported-format");

  if (file.size === 0) throw new ClassifierError("empty-file");
  if (file.size > MAX_FILE_SIZE_BYTES) throw new ClassifierError("file-too-large");
}

export async function decodeImage(file: File): Promise<ImageBitmap> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch (error) {
    throw new ClassifierError(isHeic(file) ? "heic-unsupported" : "decode-failed", undefined, { cause: error });
  }
  if (bitmap.width === 0 || bitmap.height === 0) {
    bitmap.close();
    throw new ClassifierError("decode-failed");
  }
  return bitmap;
}

const MAX_SOURCE_PIXELS = 16_000_000;

interface ResampleSpan {
  start: number;
  weights: Float64Array;
}

/**
 * Mirrors tf.image.resize(method="bilinear", antialias=True): half-pixel
 * centres and a triangle kernel widened by the downscale factor, normalised
 * over the in-bounds source pixels.
 */
function triangleSpans(inputSize: number, outputSize: number): ResampleSpan[] {
  const scale = inputSize / outputSize;
  const kernelScale = Math.max(scale, 1);
  return Array.from({ length: outputSize }, (_, index) => {
    const center = (index + 0.5) * scale;
    const start = Math.max(0, Math.ceil(center - kernelScale - 0.5));
    const end = Math.min(inputSize - 1, Math.floor(center + kernelScale - 0.5));
    const weights = new Float64Array(Math.max(0, end - start + 1));
    let total = 0;
    for (let offset = 0; offset < weights.length; offset++) {
      const weight = Math.max(0, 1 - Math.abs((start + offset + 0.5 - center) / kernelScale));
      weights[offset] = weight;
      total += weight;
    }
    if (total > 0) weights.forEach((weight, offset) => (weights[offset] = weight / total));
    return { start, weights };
  });
}

function roundHalfToEven(value: number): number {
  const rounded = Math.round(value);
  return Math.abs(value % 1) === 0.5 && rounded % 2 !== 0 ? rounded - 1 : rounded;
}

function readRgbaPixels(image: ImageBitmap): { data: Uint8ClampedArray; width: number; height: number } {
  const fit = Math.min(1, Math.sqrt(MAX_SOURCE_PIXELS / (image.width * image.height)));
  const width = Math.max(1, Math.round(image.width * fit));
  const height = Math.max(1, Math.round(image.height * fit));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new ClassifierError("unsupported-browser");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, width, height);
  return { data: context.getImageData(0, 0, width, height).data, width, height };
}

/**
 * Produces the tensor the exported model was trained on: NHWC, RGB order,
 * float32 values in [0, 255], resized to the model input without preserving
 * aspect ratio and rounded to whole pixel values exactly like load_image() in
 * the training notebook. MobileNetV2's own normalisation (x / 127.5 - 1) is
 * embedded in the model graph, so it is not repeated here.
 */
export function imageToModelInput(image: ImageBitmap, width: number, height: number): Float32Array {
  const source = readRgbaPixels(image);
  const columns = triangleSpans(source.width, width);
  const rows = triangleSpans(source.height, height);

  const horizontal = new Float64Array(source.height * width * 3);
  for (let y = 0; y < source.height; y++) {
    const rowOffset = y * source.width;
    for (let x = 0; x < width; x++) {
      const { start, weights } = columns[x];
      let red = 0;
      let green = 0;
      let blue = 0;
      for (let offset = 0; offset < weights.length; offset++) {
        const pixel = (rowOffset + start + offset) * 4;
        red += source.data[pixel] * weights[offset];
        green += source.data[pixel + 1] * weights[offset];
        blue += source.data[pixel + 2] * weights[offset];
      }
      const target = (y * width + x) * 3;
      horizontal[target] = red;
      horizontal[target + 1] = green;
      horizontal[target + 2] = blue;
    }
  }

  const rgb = new Float32Array(width * height * 3);
  for (let y = 0; y < height; y++) {
    const { start, weights } = rows[y];
    for (let x = 0; x < width; x++) {
      for (let channel = 0; channel < 3; channel++) {
        let value = 0;
        for (let offset = 0; offset < weights.length; offset++) {
          value += horizontal[((start + offset) * width + x) * 3 + channel] * weights[offset];
        }
        rgb[(y * width + x) * 3 + channel] = Math.min(255, Math.max(0, roundHalfToEven(value)));
      }
    }
  }
  return rgb;
}
