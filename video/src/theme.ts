import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Same palette as the real app (app/globals.css).
export const C = {
  canvas: "#fafaf7",
  surface: "#ffffff",
  ink: "#1c1f1d",
  inkMuted: "#565c58",
  inkSubtle: "#7a807c",
  line: "#e6e8e3",
  lineStrong: "#d3d7d0",
  brand50: "#eff8f1",
  brand100: "#d9efde",
  brand200: "#b4dfbf",
  brand300: "#84c896",
  brand500: "#2f9a52",
  brand600: "#1f7f40",
  brand700: "#186735",
  brand800: "#14522c",
  dark: "#020a05",
} as const;

export const SHADOW_CARD = "0 1px 2px rgb(28 31 29 / 0.04), 0 4px 16px rgb(28 31 29 / 0.05)";
export const SHADOW_RAISED = "0 2px 4px rgb(28 31 29 / 0.05), 0 12px 32px rgb(28 31 29 / 0.08)";

// Geist (same typeface as the app), bundled locally from the `geist` package so renders work offline.
export const FONT = "Geist, ui-sans-serif, system-ui, sans-serif";
// Geist ships no ExtraBold, so Bold also serves weight 800.
const WEIGHTS: [string, number][] = [["Regular", 400], ["Medium", 500], ["SemiBold", 600], ["Bold", 700], ["Bold", 800]];
WEIGHTS.forEach(([name, weight]) => {
  loadFont({ family: "Geist", url: staticFile(`fonts/Geist-${name}.woff2`), weight: String(weight) }).catch(() => {});
});

export const FPS = 30;
export const DURATION_S = 60;
export const STAGE_W = 1920;
export const STAGE_H = 1080;

/** Seconds → frames. */
export const sec = (s: number) => Math.round(s * FPS);

/** Set to e.g. "voiceover.mp3" (placed in public/) once the narration is recorded. */
export const VOICEOVER_FILE: string | null = null;
