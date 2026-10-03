import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ortDist = dirname(require.resolve("onnxruntime-web/ort-wasm-simd-threaded.wasm"));
const target = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "ort");

const ASSETS = ["ort.wasm.min.mjs", "ort-wasm-simd-threaded.mjs", "ort-wasm-simd-threaded.wasm"];

mkdirSync(target, { recursive: true });
for (const asset of ASSETS) {
  copyFileSync(join(ortDist, asset), join(target, asset));
}
console.log(`Copied ${ASSETS.length} ONNX Runtime Web assets to public/ort`);
