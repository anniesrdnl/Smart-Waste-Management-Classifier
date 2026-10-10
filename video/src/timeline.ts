import { Easing, interpolate } from "remotion";

/* ------------------------------------------------------------------ */
/* Virtual app viewport: everything below is in "page" pixels (1440x810) */
/* ------------------------------------------------------------------ */

export const VIEW_W = 1440;
export const VIEW_H = 810;
export const HEADER_H = 64;
export const HERO_H = 740;
export const SCROLL_TARGET = 720;

export const CARD = { x: 40, y: HERO_H + 64, w: 1360, h: 700 } as const;
export const DROP = { x: 60, y: CARD.y + 132, w: 750, h: 548 } as const;
export const RESULT_PANEL = { x: 830, y: CARD.y + 112, w: 570, h: 588 } as const;

export type ClassId = "cardboard" | "glass" | "metal" | "paper" | "plastic" | "trash";
export const CLASS_ORDER: ClassId[] = ["cardboard", "glass", "metal", "paper", "plastic", "trash"];
export const LABEL: Record<ClassId, string> = {
  cardboard: "Cardboard",
  glass: "Glass",
  metal: "Metal",
  paper: "Paper",
  plastic: "Plastic",
  trash: "Trash",
};

export type PhotoId = "plastic" | "cardboard" | "glass" | "metal" | "paper" | "trash" | "water";

export interface Sample {
  photo: PhotoId;
  cls: ClassId;
  file: string;
  size: string;
  /** Probabilities in descending order, sum = 100. */
  probs: [ClassId, number][];
  ms: number;
}

export const SAMPLES: Record<PhotoId, Sample> = {
  plastic: {
    photo: "plastic", cls: "plastic", file: "plastic_bottle.jpg", size: "96.2 KB · 800 × 800 px", ms: 41,
    probs: [["plastic", 98.7], ["glass", 0.62], ["trash", 0.41], ["metal", 0.17], ["paper", 0.06], ["cardboard", 0.04]],
  },
  cardboard: {
    photo: "cardboard", cls: "cardboard", file: "cardboard_box.jpg", size: "88.4 KB · 800 × 800 px", ms: 38,
    probs: [["cardboard", 96.4], ["paper", 2.31], ["trash", 0.88], ["plastic", 0.22], ["glass", 0.11], ["metal", 0.08]],
  },
  glass: {
    photo: "glass", cls: "glass", file: "glass_bottle.jpg", size: "74.9 KB · 800 × 800 px", ms: 44,
    probs: [["glass", 94.2], ["plastic", 3.71], ["metal", 1.2], ["trash", 0.6], ["paper", 0.2], ["cardboard", 0.09]],
  },
  metal: {
    photo: "metal", cls: "metal", file: "metal_can.jpg", size: "74.7 KB · 800 × 800 px", ms: 47,
    probs: [["metal", 97.1], ["trash", 1.4], ["glass", 0.9], ["plastic", 0.4], ["paper", 0.15], ["cardboard", 0.05]],
  },
  paper: {
    photo: "paper", cls: "paper", file: "paper_sheets.jpg", size: "81.3 KB · 800 × 800 px", ms: 36,
    probs: [["paper", 92.8], ["cardboard", 4.6], ["trash", 1.8], ["plastic", 0.5], ["glass", 0.2], ["metal", 0.1]],
  },
  trash: {
    photo: "trash", cls: "trash", file: "trash_bag.jpg", size: "102.8 KB · 800 × 800 px", ms: 40,
    probs: [["trash", 89.5], ["plastic", 4.8], ["paper", 2.6], ["metal", 1.5], ["cardboard", 1.0], ["glass", 0.6]],
  },
  water: {
    photo: "water", cls: "plastic", file: "plastic_water.jpg", size: "91.0 KB · 800 × 800 px", ms: 39,
    probs: [["plastic", 97.6], ["glass", 1.1], ["trash", 0.7], ["metal", 0.4], ["paper", 0.1], ["cardboard", 0.1]],
  },
};

/** File-picker listing, alphabetical like a real dialog. */
export const PICKER_FILES: PhotoId[] = ["cardboard", "glass", "metal", "paper", "plastic", "water", "trash"];
const pickerIndex = (p: PhotoId) => PICKER_FILES.indexOf(p);

/* ------------------------------ Runs ------------------------------- */

export interface Run {
  photo: PhotoId;
  /** Click on Browse / Replace. */
  clickT: number;
  /** File picker visible from..to (to = image shown). */
  pickerOpen: number;
  imageIn: number;
  analyzeClick: number;
  resultIn: number;
  end: number;
}

function quickRun(photo: PhotoId, t0: number, dur: number): Run {
  // Compressed beat that fits `dur` seconds: replace → pick → analyze → result.
  const k = dur / 3;
  return {
    photo,
    clickT: t0 + 0.15 * k,
    pickerOpen: t0 + 0.25 * k,
    imageIn: t0 + 0.6 * k + 0.0,
    analyzeClick: t0 + 1.15 * k,
    resultIn: t0 + 1.55 * k,
    end: t0 + dur,
  };
}

export const RUNS: Run[] = [
  // 0:11–0:29 — the hero demonstration (slow, readable)
  { photo: "plastic", clickT: 11.1, pickerOpen: 11.2, imageIn: 12.6, analyzeClick: 19.9, resultIn: 21.7, end: 29 },
  // 0:29–0:42 — quick cuts
  quickRun("cardboard", 29, 3),
  quickRun("glass", 32, 3),
  quickRun("metal", 35, 3),
  quickRun("paper", 38, 2),
  quickRun("trash", 40, 2),
  // 0:51–0:57 — final interaction
  { photo: "water", clickT: 51.4, pickerOpen: 51.5, imageIn: 52.2, analyzeClick: 53.7, resultIn: 54.9, end: 57 },
];

export type Phase = "empty" | "picker" | "selected" | "classifying" | "result";

export interface UIState {
  phase: Phase;
  /** Run whose image/result is currently on screen (undefined before first upload). */
  run?: Run;
  /** Run being picked (picker open) */
  picking?: Run;
  /** Seconds since the current phase began. */
  since: number;
  /** Underlying shown state while the picker is open. */
  under: Exclude<Phase, "picker">;
  underRun?: Run;
}

export function uiState(t: number): UIState {
  let idx = -1;
  for (let i = 0; i < RUNS.length; i++) if (t >= RUNS[i].clickT) idx = i;
  const prev = idx > 0 ? RUNS[idx - 1] : undefined;

  if (idx === -1) return { phase: "empty", since: t, under: "empty" };
  const r = RUNS[idx];

  if (t < r.pickerOpen) {
    // Just clicked, picker not yet open: still the previous state.
    return prev
      ? { phase: "result", run: prev, since: t - prev.resultIn, under: "result", underRun: prev }
      : { phase: "empty", since: t, under: "empty" };
  }
  if (t < r.imageIn) {
    return prev
      ? { phase: "picker", picking: r, run: prev, since: t - r.pickerOpen, under: "result", underRun: prev }
      : { phase: "picker", picking: r, since: t - r.pickerOpen, under: "empty" };
  }
  if (t < r.analyzeClick) return { phase: "selected", run: r, since: t - r.imageIn, under: "selected", underRun: r };
  if (t < r.resultIn) return { phase: "classifying", run: r, since: t - r.analyzeClick, under: "classifying", underRun: r };
  return { phase: "result", run: r, since: t - r.resultIn, under: "result", underRun: r };
}

/* ----------------------------- Scrolling --------------------------- */

const easeIO = Easing.inOut(Easing.cubic);

export function scrollY(t: number): number {
  return interpolate(t, [5.75, 7.15], [0, SCROLL_TARGET], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/* ------------------------------ Cursor ----------------------------- */
// Positions are viewport coords (what you see at scroll = SCROLL_TARGET, or scroll = 0 for the hero).

export interface Waypoint {
  t: number;
  x: number;
  y: number;
  click?: boolean;
}

const P = {
  browse: { x: 435, y: CARD.y + 132 + 340 - SCROLL_TARGET },
  replace: { x: 623, y: DROP.y + DROP.h - 12 - 28 - SCROLL_TARGET },
  analyze: { x: 1115, y: RESULT_PANEL.y + 32 + 100 + 20 + 24 - SCROLL_TARGET },
  heroCta: { x: 134, y: 513 },
  pickerOpenBtn: { x: 982, y: 611 },
};
export const TARGETS = P;

const pickerRow = (photo: PhotoId) => ({ x: 690, y: 170 + 52 + 8 + 24 + 48 * pickerIndex(photo) });

function runWaypoints(r: Run, i: number): Waypoint[] {
  const w: Waypoint[] = [];
  const from = i === 0 ? P.browse : P.replace;
  const dur = r.imageIn - r.pickerOpen;
  const row = pickerRow(r.photo);
  w.push({ t: r.clickT, ...from, click: true });
  if (dur > 1) {
    w.push({ t: r.pickerOpen + dur * 0.38, ...row, click: true });
    w.push({ t: r.pickerOpen + dur * 0.8, ...P.pickerOpenBtn, click: true });
  } else {
    w.push({ t: r.pickerOpen + dur * 0.55, ...row, click: true });
  }
  return w;
}

export function cursorWaypoints(): Waypoint[] {
  const w: Waypoint[] = [
    { t: 3.9, x: 1010, y: 640 },
    { t: 5.45, x: P.heroCta.x, y: P.heroCta.y, click: true },
    { t: 6.3, x: 300, y: 560 },
    { t: 8.4, x: 360, y: 500 },
    { t: 9.7, x: 520, y: 470 },
    { t: 10.85, x: P.browse.x, y: P.browse.y },
  ];

  RUNS.forEach((r, i) => {
    w.push(...runWaypoints(r, i));

    if (i === 0) {
      // Pause on the preview, then head for Analyze.
      w.push({ t: 13.9, x: 520, y: 330 });
      w.push({ t: 16.0, x: 420, y: 300 });
      w.push({ t: 17.9, x: 330, y: 700 });
      w.push({ t: r.analyzeClick - 0.15, x: P.analyze.x, y: P.analyze.y });
      w.push({ t: r.analyzeClick, x: P.analyze.x, y: P.analyze.y, click: true });
      // Drift across the result while it's explained.
      w.push({ t: 23.6, x: 1100, y: 250 });
      w.push({ t: 26.0, x: 1080, y: 360 });
      w.push({ t: 28.4, x: 900, y: 600 });
    } else if (i === RUNS.length - 1) {
      w.push({ t: r.imageIn + 0.6, x: 500, y: 330 });
      w.push({ t: r.analyzeClick - 0.15, x: P.analyze.x, y: P.analyze.y });
      w.push({ t: r.analyzeClick, x: P.analyze.x, y: P.analyze.y, click: true });
      w.push({ t: 56.0, x: 1130, y: 560 });
      w.push({ t: 57.5, x: 1180, y: 600 });
    } else {
      const k = (r.end - r.clickT) / 3;
      w.push({ t: r.analyzeClick - 0.12 * k, x: P.analyze.x, y: P.analyze.y });
      w.push({ t: r.analyzeClick, x: P.analyze.x, y: P.analyze.y, click: true });
      // Hover over the result, then swing back to Replace for the next cut.
      w.push({ t: r.resultIn + 0.5 * k, x: 1090, y: 330 });
      w.push({ t: r.end + 0.02, x: P.replace.x, y: P.replace.y });
    }
  });

  // Purpose section (42–51): cursor just drifts between the panels.
  w.push({ t: 44.0, x: 900, y: 450 });
  w.push({ t: 46.5, x: 1150, y: 300 });
  w.push({ t: 49.0, x: 420, y: 420 });
  w.push({ t: 50.8, x: P.replace.x, y: P.replace.y });

  return w.sort((a, b) => a.t - b.t).filter((p, i, a) => i === 0 || p.t > a[i - 1].t);
}

const WAYPOINTS = cursorWaypoints();
export const CLICK_POINTS = WAYPOINTS.filter((p) => p.click);
export const CLICKS = CLICK_POINTS.map((p) => p.t);

export interface CursorPose {
  x: number;
  y: number;
  visible: number;
  pressed: number;
}

export function cursorAt(t: number): CursorPose {
  const first = WAYPOINTS[0];
  const last = WAYPOINTS[WAYPOINTS.length - 1];
  let x = first.x;
  let y = first.y;
  if (t >= last.t) {
    x = last.x;
    y = last.y;
  } else if (t > first.t) {
    let i = 0;
    while (WAYPOINTS[i + 1].t < t) i++;
    const a = WAYPOINTS[i];
    const b = WAYPOINTS[i + 1];
    const p = easeIO((t - a.t) / (b.t - a.t));
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.hypot(dx, dy) || 1;
    // Slight arc so the motion feels human, not linear.
    const bend = Math.min(40, dist * 0.08) * Math.sin(Math.PI * p);
    x = a.x + dx * p + (-dy / dist) * bend;
    y = a.y + dy * p + (dx / dist) * bend;
  }

  let pressed = 0;
  for (const c of CLICKS) {
    const d = t - c;
    if (d > -0.05 && d < 0.2) pressed = Math.max(pressed, 1 - Math.abs(d - 0.05) / 0.15);
  }
  const visible = interpolate(t, [3.85, 4.2, 57.0, 57.5], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { x, y, visible, pressed: Math.max(0, pressed) };
}

/* ------------------------------ Camera ----------------------------- */

interface CamKey {
  t: number;
  s: number;
  x: number;
  y: number;
}

const CAM: CamKey[] = [
  { t: 2.4, s: 1.0, x: 720, y: 405 },
  { t: 5.0, s: 1.05, x: 720, y: 370 }, // slight zoom into the interface
  { t: 5.5, s: 1.05, x: 720, y: 370 },
  { t: 7.2, s: 1.0, x: 720, y: 405 },
  { t: 8.2, s: 1.0, x: 720, y: 405 },
  { t: 10.4, s: 1.22, x: 430, y: 380 }, // highlight the upload area
  { t: 12.6, s: 1.22, x: 430, y: 380 },
  { t: 15.5, s: 1.32, x: 430, y: 330 }, // push in on the preview
  { t: 18.6, s: 1.26, x: 640, y: 380 },
  { t: 19.9, s: 1.2, x: 800, y: 390 }, // glide to Analyze
  { t: 22.6, s: 1.2, x: 800, y: 395 }, // result lands: image + result both in frame
  { t: 25.5, s: 1.16, x: 800, y: 400 },
  { t: 28.6, s: 1.04, x: 740, y: 405 },
  { t: 29.4, s: 1.0, x: 720, y: 405 }, // quick cuts: full frame so every swap is readable
  { t: 41.8, s: 1.0, x: 720, y: 405 },
  { t: 50.0, s: 1.0, x: 720, y: 405 }, // pull-back for the "purpose" beat
  { t: 51.9, s: 1.06, x: 720, y: 400 },
  { t: 54.4, s: 1.07, x: 730, y: 400 },
  { t: 55.6, s: 1.2, x: 800, y: 395 }, // result + check
  { t: 57.3, s: 1.14, x: 800, y: 400 },
];

export function cameraAt(t: number): { s: number; tx: number; ty: number } {
  const ts = CAM.map((k) => k.t);
  const opts = { easing: easeIO, extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const s = interpolate(t, ts, CAM.map((k) => k.s), opts);
  const fx = interpolate(t, ts, CAM.map((k) => k.x), opts);
  const fy = interpolate(t, ts, CAM.map((k) => k.y), opts);
  // Keep the focal point centred but never reveal outside the page.
  const tx = Math.min(0, Math.max(VIEW_W - s * VIEW_W, VIEW_W / 2 - s * fx));
  const ty = Math.min(0, Math.max(VIEW_H - s * VIEW_H, VIEW_H / 2 - s * fy));
  return { s, tx, ty };
}

/* ------------------------------ Captions --------------------------- */

export const CAPTIONS: { from: number; to: number; text: string }[] = [
  { from: 0.5, to: 4.9, text: "Can artificial intelligence help us identify waste in just seconds?" },
  { from: 5.2, to: 10.9, text: "Our Smart Waste Management Classifier uses computer vision to identify different types of waste from uploaded images." },
  { from: 11.2, to: 19.8, text: "To begin, the user simply uploads an image of the waste they want to identify." },
  { from: 20.1, to: 28.8, text: "The trained model analyzes the image and predicts its waste category, together with its confidence score." },
  { from: 29.2, to: 41.8, text: "The system can classify six waste categories: cardboard, glass, metal, paper, plastic, and trash." },
  { from: 42.2, to: 50.8, text: "This provides users with a simple and accessible way to recognize different waste materials and support proper waste classification." },
  { from: 51.2, to: 56.8, text: "One image, one prediction, and a smarter approach to understanding waste." },
  { from: 57.2, to: 59.9, text: "Smart Waste Management Classifier. Classify smarter, manage waste better." },
];
