import React from "react";
import { Easing, Img, interpolate, staticFile } from "remotion";
import {
  ArrowRight, Check, ChartNoAxesColumn, Cylinder, FileImage, ImageUp, LoaderCircle, Lock, Milk, Newspaper,
  Package, RefreshCw, RotateCcw, ScanSearch, Trash2, Wine, X, ArrowDownRight, type LucideIcon,
} from "lucide-react";
import { C, FONT, SHADOW_CARD, SHADOW_RAISED } from "../theme";
import {
  cameraAt, CARD, CLASS_ORDER, DROP, HEADER_H, HERO_H, LABEL, PICKER_FILES, RESULT_PANEL, SAMPLES, SCROLL_TARGET, VIEW_H, VIEW_W,
  RUNS, scrollY, uiState, type ClassId, type Run,
} from "../timeline";
import { Photo } from "./Photos";

const ICONS: Record<ClassId, LucideIcon> = {
  cardboard: Package, glass: Wine, metal: Cylinder, paper: Newspaper, plastic: Milk, trash: Trash2,
};

const GRID_BG: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, rgb(28 31 29 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(28 31 29 / 0.05) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
};
const gridMask = (stop: number): React.CSSProperties => ({
  ...GRID_BG,
  position: "absolute",
  inset: 0,
  WebkitMaskImage: `radial-gradient(ellipse at center, black ${stop}%, transparent 72%)`,
  maskImage: `radial-gradient(ellipse at center, black ${stop}%, transparent 72%)`,
});

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOut = Easing.out(Easing.cubic);

/* -------------------------------- Buttons ------------------------------- */

const Btn: React.FC<{
  variant: "primary" | "secondary";
  style?: React.CSSProperties;
  hover?: boolean;
  pressed?: boolean;
  children: React.ReactNode;
}> = ({ variant, style, hover, pressed, children }) => {
  const primary = variant === "primary";
  return (
    <div
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 12,
        fontWeight: 600, whiteSpace: "nowrap",
        background: primary ? (pressed ? C.brand800 : hover ? C.brand700 : C.brand600) : hover ? C.brand50 : C.surface,
        color: primary ? "#fff" : hover ? C.brand800 : C.ink,
        border: primary ? "none" : `1px solid ${hover ? C.brand300 : C.lineStrong}`,
        boxShadow: primary ? (hover && !pressed ? "0 6px 16px -4px rgb(20 82 44 / 0.35)" : "0 1px 2px rgb(20 82 44 / 0.25)") : "none",
        transform: pressed ? "translateY(1px) scale(0.985)" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* -------------------------------- Header -------------------------------- */

const NAV = [
  { label: "Home", w: 66 },
  { label: "Classify Waste", w: 126 },
  { label: "How It Works", w: 116 },
  { label: "About", w: 70 },
];

const Header: React.FC<{ scroll: number; hoverCta: boolean }> = ({ scroll, hoverCta }) => {
  const active = scroll > 360 ? 1 : 0;
  const total = NAV.reduce((a, n) => a + n.w, 0);
  const startX = (VIEW_W - total) / 2;
  const lefts = NAV.map((_, i) => startX + NAV.slice(0, i).reduce((a, n) => a + n.w, 0));
  // Slide the underline between items as the page scrolls.
  const k = clamp01((scroll - 300) / 180);
  const ux = lefts[0] + (lefts[1] - lefts[0]) * easeOut(k) + 14;
  const uw = NAV[0].w - 28 + (NAV[1].w - NAV[0].w) * easeOut(k);
  const scrolled = scroll > 8;

  return (
    <div
      style={{
        position: "absolute", top: 0, left: 0, width: VIEW_W, height: HEADER_H, zIndex: 40,
        background: scrolled ? "rgb(255 255 255 / 0.9)" : C.surface,
        borderBottom: `1px solid ${scrolled ? C.line : "transparent"}`,
        boxShadow: scrolled ? "0 1px 12px rgb(28 31 29 / 0.05)" : "none",
        backdropFilter: scrolled ? "blur(14px) saturate(1.5)" : undefined,
      }}
    >
      <div style={{ position: "absolute", left: 40, top: 12, width: 60, height: 40, borderRadius: 8, overflow: "hidden", background: "#000" }}>
        <Img src={staticFile("logo.png")} style={{ width: 60, height: 40, objectFit: "contain" }} />
      </div>
      <div style={{ position: "absolute", left: startX, top: 0, height: HEADER_H, display: "flex" }}>
        {NAV.map((n, i) => (
          <div
            key={n.label}
            style={{
              width: n.w, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 500,
              color: i === active ? C.ink : C.inkMuted,
            }}
          >
            {n.label}
          </div>
        ))}
        <div style={{ position: "absolute", bottom: -1, left: ux - startX, width: uw, height: 2, borderRadius: 2, background: C.brand600 }} />
      </div>
      <Btn
        variant="primary"
        hover={hoverCta}
        style={{ position: "absolute", right: 40, top: 13, height: 38, padding: "0 14px 0 16px", fontSize: 14 }}
      >
        Try Classifier <ArrowRight size={16} />
      </Btn>
    </div>
  );
};

/* ---------------------------------- Hero -------------------------------- */

const HeroVisual: React.FC<{ t: number }> = ({ t }) => {
  const idx = Math.floor(t / 0.9) % 6;
  const cls = CLASS_ORDER[idx];
  const Icon = ICONS[cls];
  const sweep = (Math.sin(t * 2.2) + 1) / 2;
  return (
    <div
      style={{
        position: "absolute", left: 724, top: 157 - HEADER_H, width: 676, height: 490, borderRadius: 24, border: `1px solid ${C.line}`,
        background: C.canvas, boxShadow: SHADOW_RAISED, padding: 24, boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.inkMuted, padding: "0 4px" }}>
        <span>Image analysis</span>
        <span>MobileNetV2 · 224 × 224</span>
      </div>
      <div
        style={{
          position: "relative", marginTop: 14, height: 330, borderRadius: 16, border: `1px solid ${C.line}`,
          background: C.surface, overflow: "hidden",
        }}
      >
        <div style={gridMask(40)} />
        {[
          { l: 190, tp: 80, br: "tl" }, { l: 414, tp: 80, br: "tr" }, { l: 190, tp: 250, br: "bl" }, { l: 414, tp: 250, br: "br" },
        ].map((b) => (
          <div
            key={b.br}
            style={{
              position: "absolute", left: b.l, top: b.tp - 36, width: 22, height: 22, borderColor: C.brand600, borderStyle: "solid",
              borderWidth: 0, ...(b.br.includes("t") ? { borderTopWidth: 2 } : { borderBottomWidth: 2 }),
              ...(b.br.includes("l") ? { borderLeftWidth: 2 } : { borderRightWidth: 2 }),
              borderRadius: b.br === "tl" ? "8px 0 0 0" : b.br === "tr" ? "0 8px 0 0" : b.br === "bl" ? "0 0 0 8px" : "0 0 8px 0",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute", left: 190, right: 190, top: 60 + sweep * 190, height: 2, borderRadius: 2, background: C.brand500,
            boxShadow: "0 0 18px 4px rgb(47 154 82 / 0.35)", opacity: 0.8,
          }}
        />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#3c4240" }}>
          <Icon size={150} strokeWidth={1.5} />
        </div>
        <div
          style={{
            position: "absolute", left: 150, top: 28, display: "inline-flex", alignItems: "center", gap: 6, background: C.brand600,
            color: "#fff", fontSize: 12, fontWeight: 600, borderRadius: 8, padding: "6px 10px",
          }}
        >
          <Icon size={13} /> {LABEL[cls]}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        {CLASS_ORDER.map((id) => {
          const I = ICONS[id];
          const on = id === cls;
          return (
            <div
              key={id}
              style={{
                flex: 1, height: 62, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 6, fontSize: 12, fontWeight: 500, border: `1px solid ${on ? C.brand300 : C.line}`, background: on ? C.brand50 : C.surface,
                color: on ? C.brand800 : C.inkMuted,
              }}
            >
              <I size={18} strokeWidth={1.75} />
              {LABEL[id]}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Hero: React.FC<{ t: number; hoverCta: boolean; ctaPressed: boolean }> = ({ t, hoverCta, ctaPressed }) => (
  <div style={{ position: "absolute", left: 0, top: HEADER_H, width: VIEW_W, height: HERO_H - HEADER_H, background: C.surface, borderBottom: `1px solid ${C.line}` }}>
    <div style={{ position: "absolute", left: 40, top: 157 - HEADER_H, width: 588 }}>
      <div
        style={{
          display: "inline-flex", alignItems: "center", gap: 8, height: 28, padding: "0 12px", borderRadius: 999,
          border: `1px solid ${C.brand200}`, background: C.brand50, color: C.brand800, fontSize: 12, fontWeight: 500,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: 6, background: C.brand500 }} />
        AI-Powered Waste Classification
      </div>
      <div style={{ marginTop: 24, fontSize: 60, fontWeight: 700, letterSpacing: -1.8, lineHeight: "66px", color: C.ink }}>
        Sort Smarter.
        <br />
        <span style={{ color: C.brand700 }}>Waste Better.</span>
      </div>
      <div style={{ marginTop: 24, maxWidth: 512, fontSize: 18, lineHeight: "30px", color: C.inkMuted }}>
        Use computer vision to quickly identify common waste materials and receive guidance on how they should be handled.
      </div>
      <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
        <Btn variant="primary" hover={hoverCta} pressed={ctaPressed} style={{ height: 52, padding: "0 24px", fontSize: 16 }}>
          Classify Waste <ArrowRight size={16} />
        </Btn>
        <Btn variant="secondary" style={{ height: 52, padding: "0 24px", fontSize: 16 }}>How It Works</Btn>
      </div>
      <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${C.line}`, display: "flex" }}>
        {[["Recognises", "6 materials"], ["Runs", "On your device"], ["Model", "MobileNetV2"]].map(([l, v], i) => (
          <div key={l} style={{ paddingLeft: i ? 20 : 0, paddingRight: 20, borderLeft: i ? `1px solid ${C.line}` : "none" }}>
            <div style={{ fontSize: 12, color: C.inkSubtle }}>{l}</div>
            <div style={{ marginTop: 4, fontSize: 16, fontWeight: 600, color: C.ink }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
    <HeroVisual t={t} />
  </div>
);

/* ------------------------------ Classifier ------------------------------- */

const CategoryIcon: React.FC<{ id: ClassId; size: number; color?: string }> = ({ id, size, color }) => {
  const I = ICONS[id];
  return <I size={size} strokeWidth={1.75} color={color} />;
};

const ModelBadge: React.FC = () => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 26, padding: "0 12px", borderRadius: 999, border: `1px solid ${C.line}`, background: C.canvas, fontSize: 12, fontWeight: 500, color: C.inkMuted }}>
    <span style={{ width: 8, height: 8, borderRadius: 8, background: C.brand500 }} />
    Model ready
  </div>
);

const Dropzone: React.FC<{ hover: boolean; pressed: boolean }> = ({ hover, pressed }) => (
  <div
    style={{
      position: "absolute", left: 20, top: 132, width: DROP.w, height: DROP.h, boxSizing: "border-box", borderRadius: 16,
      border: `2px dashed ${hover ? C.brand300 : C.lineStrong}`, background: hover ? "rgb(239 248 241 / 0.55)" : C.canvas, overflow: "hidden",
    }}
  >
    <div style={gridMask(20)} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 154, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          width: 64, height: 64, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
          background: hover ? C.brand600 : C.surface, color: hover ? "#fff" : C.brand700, boxShadow: SHADOW_CARD,
          border: `1px solid ${hover ? C.brand600 : C.line}`, transform: hover ? "translateY(-4px)" : undefined,
        }}
      >
        <ImageUp size={28} strokeWidth={1.75} />
      </div>
      <div style={{ marginTop: 24, fontSize: 20, fontWeight: 600, letterSpacing: -0.3, color: C.ink, height: 28, lineHeight: "28px" }}>Drop your image here</div>
      <div style={{ marginTop: 16, width: 176, height: 16, display: "flex", alignItems: "center", gap: 12, fontSize: 12, fontWeight: 500, letterSpacing: 1, color: C.inkSubtle }}>
        <span style={{ flex: 1, height: 1, background: C.lineStrong }} /> OR <span style={{ flex: 1, height: 1, background: C.lineStrong }} />
      </div>
      <Btn variant="primary" hover={hover} pressed={pressed} style={{ marginTop: 16, height: 44, padding: "0 24px", fontSize: 16 }}>
        Browse files
      </Btn>
      <div style={{ marginTop: 16, fontSize: 12, color: C.inkSubtle }}>Supported formats: JPG, PNG or WEBP · up to 20&nbsp;MB</div>
    </div>
  </div>
);

/** Fit a photo of the given pixel size inside the preview area, like object-contain. */
const AREA_W = DROP.w - 66;
const AREA_H = DROP.h - 120;
const boxFor = (dims?: [number, number]): React.CSSProperties => {
  const aspect = dims ? dims[0] / dims[1] : 1;
  const w = Math.min(AREA_W, AREA_H * aspect);
  return { width: w, height: w / aspect };
};

const Preview: React.FC<{
  run: Run; phase: "selected" | "classifying" | "result"; since: number; t: number; hoverReplace: boolean; replacePressed: boolean;
}> = ({ run, phase, since, t, hoverReplace, replacePressed }) => {
  const s = SAMPLES[run.photo];
  const appear = easeOut(clamp01(since / 0.28));
  const Icon = ICONS[s.cls];
  const badge = phase === "result" ? easeOut(clamp01(since / 0.3)) : 0;
  const sweepP = (t * 1.25) % 2;
  const sweep = sweepP < 1 ? sweepP : 2 - sweepP;
  const conf = s.probs[0][1];

  return (
    <div
      style={{
        position: "absolute", left: 20, top: 132, width: DROP.w, height: DROP.h, boxSizing: "border-box", borderRadius: 16,
        border: `1px solid ${C.line}`, background: C.canvas, overflow: "hidden",
      }}
    >
      <div style={gridMask(30)} />
      <div
        style={{
          position: "absolute", left: 32, top: 32, width: DROP.w - 66, height: DROP.h - 120, display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div
          style={{
            ...boxFor(s.dims), borderRadius: 6, overflow: "hidden", boxShadow: "0 8px 24px rgb(28 31 29 / 0.14)",
            opacity: appear, transform: `scale(${0.94 + 0.06 * appear})`, position: "relative",
          }}
        >
          <Photo id={run.photo} fit="contain" />
          {phase === "classifying" && (
            <div style={{ position: "absolute", inset: 0, background: "rgb(47 154 82 / 0.07)" }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: `${sweep * 100}%`, height: 3, background: C.brand500, boxShadow: "0 0 18px 4px rgb(47 154 82 / 0.5)" }} />
            </div>
          )}
        </div>
      </div>

      {badge > 0 && (
        <div
          style={{
            position: "absolute", left: 12, top: 12, display: "inline-flex", alignItems: "center", gap: 6, background: C.brand600, color: "#fff",
            fontSize: 12, fontWeight: 600, borderRadius: 8, padding: "6px 10px", boxShadow: SHADOW_CARD, opacity: badge,
            transform: `scale(${0.7 + 0.3 * Easing.out(Easing.back(2))(badge)})`, transformOrigin: "left top",
          }}
        >
          <Icon size={13} /> {LABEL[s.cls]} <span style={{ opacity: 0.8 }}>{conf.toFixed(2)}%</span>
        </div>
      )}

      <div
        style={{
          position: "absolute", left: 12, right: 12, bottom: 12, height: 56, borderRadius: 12, border: `1px solid ${C.line}`,
          background: "rgb(255 255 255 / 0.92)", boxShadow: SHADOW_CARD, display: "flex", alignItems: "center", padding: "0 8px 0 12px", gap: 12,
          boxSizing: "border-box",
        }}
      >
        <FileImage size={20} color={C.inkSubtle} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: C.ink }}>{s.file}</div>
          <div style={{ fontSize: 12, color: C.inkMuted }}>{s.size}</div>
        </div>
        <Btn variant="secondary" hover={hoverReplace} pressed={replacePressed} style={{ height: 36, width: 110, fontSize: 14, borderRadius: 12, opacity: phase === "classifying" ? 0.5 : 1 }}>
          <RefreshCw size={16} /> Replace
        </Btn>
        <Btn variant="secondary" style={{ height: 36, width: 104, fontSize: 14, borderRadius: 12, opacity: phase === "classifying" ? 0.5 : 1 }}>
          <X size={16} /> Remove
        </Btn>
      </div>
    </div>
  );
};

const Placeholder: React.FC<{ state: "empty" | "selected" | "classifying"; t: number; hoverAnalyze: boolean; pressed: boolean }> = ({ state, t, hoverAnalyze, pressed }) => {
  const classifying = state === "classifying";
  const copy = {
    empty: ["Awaiting an image", "Upload a photo and the predicted category, confidence scores and disposal guidance will appear here."],
    selected: ["Ready to analyze", "Click Analyze Waste to identify the material in your image."],
    classifying: ["Analyzing image...", "The model is examining the image on your device."],
  }[state];
  const tips = ["One waste item per photo", "Good, even lighting", "Plain, uncluttered background", "The item fills most of the frame"];

  return (
    <div style={{ position: "absolute", left: 32, top: 32, width: RESULT_PANEL.w - 64 }}>
      <div style={{ display: "flex", gap: 16, height: 100 }}>
        <div
          style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
            background: state === "empty" ? C.surface : C.brand600, color: state === "empty" ? C.inkSubtle : "#fff",
            border: `1px solid ${state === "empty" ? C.line : C.brand600}`,
          }}
        >
          {classifying ? <LoaderCircle size={20} style={{ transform: `rotate(${t * 480}deg)` }} /> : <ChartNoAxesColumn size={20} />}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, color: C.inkSubtle, textTransform: "uppercase" }}>Classification Result</div>
          <div style={{ marginTop: 4, fontSize: 18, fontWeight: 600, color: C.ink }}>{copy[0]}</div>
          <div style={{ marginTop: 4, fontSize: 14, lineHeight: "21px", color: C.inkMuted }}>{copy[1]}</div>
        </div>
      </div>

      {state !== "empty" && (
        <Btn
          variant="primary" hover={hoverAnalyze} pressed={pressed}
          style={{ marginTop: 20, width: "100%", height: 48, fontSize: 16, ...(classifying ? { background: C.inkSubtle, opacity: 0.8 } : {}) }}
        >
          {classifying ? <LoaderCircle size={16} style={{ transform: `rotate(${t * 480}deg)` }} /> : <ScanSearch size={16} />}
          {classifying ? "Analyzing image..." : "Analyze Waste"}
        </Btn>
      )}

      <div style={{ position: "absolute", left: 0, right: 0, top: state === "empty" ? 120 : 188, border: `1px dashed ${C.lineStrong}`, borderRadius: 12, padding: 14, background: "rgb(255 255 255 / 0.6)", boxSizing: "border-box" }}>
        {CLASS_ORDER.map((id, i) => (
          <div key={id} style={{ display: "grid", gridTemplateColumns: "20px 96px 1fr 40px", alignItems: "center", gap: 12, height: 28 }}>
            <CategoryIcon id={id} size={16} color={C.inkSubtle} />
            <span style={{ fontSize: 14, color: C.inkSubtle }}>{LABEL[id]}</span>
            <span style={{ height: 8, borderRadius: 8, background: C.line, overflow: "hidden" }}>
              {classifying && (
                <span style={{ display: "block", height: "100%", width: "40%", borderRadius: 8, background: C.brand200, opacity: 0.5 + 0.5 * Math.sin(t * 7 - i * 0.9) ** 2 }} />
              )}
            </span>
            <span style={{ textAlign: "right", fontSize: 14, color: "rgb(122 128 124 / 0.7)" }}>—</span>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", left: 0, top: state === "empty" ? 336 : 404 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.inkMuted }}>For the most reliable result</div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", width: RESULT_PANEL.w - 64 }}>
          {tips.map((tip) => (
            <div key={tip} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.inkMuted }}>
              <span style={{ width: 16, height: 16, borderRadius: 16, background: C.brand100, color: C.brand700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Check size={10} strokeWidth={3} />
              </span>
              {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Result: React.FC<{ run: Run; since: number; hoverClassify: boolean }> = ({ run, since, hoverClassify }) => {
  const s = SAMPLES[run.photo];
  const Icon = ICONS[s.cls];
  const enter = easeOut(clamp01(since / 0.35));
  const grow = easeOut(clamp01((since - 0.1) / 0.8));
  const conf = s.probs[0][1];

  return (
    <div style={{ position: "absolute", left: 32, top: 32, width: RESULT_PANEL.w - 64, height: RESULT_PANEL.h - 64, opacity: enter, transform: `translateY(${(1 - enter) * 8}px)` }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, color: C.inkSubtle, textTransform: "uppercase" }}>Classification Result</div>
          <div style={{ marginTop: 8, fontSize: 40, fontWeight: 700, letterSpacing: -1, color: C.ink, lineHeight: "44px" }}>{LABEL[s.cls]}</div>
          <div style={{ marginTop: 8, display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: C.brand700, fontVariantNumeric: "tabular-nums" }}>{(conf * grow).toFixed(2)}%</span>
            <span style={{ fontSize: 14, color: C.inkMuted }}>confidence</span>
          </div>
        </div>
        <div
          style={{
            width: 56, height: 56, borderRadius: 16, background: C.brand600, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: SHADOW_CARD, transform: `scale(${0.6 + 0.4 * Easing.out(Easing.back(2.2))(clamp01(since / 0.4))})`,
          }}
        >
          <Icon size={28} strokeWidth={1.75} />
        </div>
      </div>

      <div style={{ marginTop: 24, borderRadius: 12, border: `1px solid ${C.line}`, background: C.surface, padding: 16 }}>
        <div style={{ padding: "0 8px", fontSize: 14, fontWeight: 600, color: C.ink }}>Confidence by category</div>
        <div style={{ marginTop: 8 }}>
          {s.probs.map(([id, p], i) => {
            const first = i === 0;
            const g = easeOut(clamp01((since - 0.12 - i * 0.06) / 0.7));
            return (
              <div key={id} style={{ display: "grid", gridTemplateColumns: "104px 1fr 72px", alignItems: "center", gap: 12, height: 34, padding: "0 8px" }}>
                <span style={{ fontSize: 14, fontWeight: first ? 600 : 400, color: first ? C.ink : C.inkMuted }}>{LABEL[id]}</span>
                <span style={{ height: 10, borderRadius: 10, background: C.line, overflow: "hidden" }}>
                  <span style={{ display: "block", height: "100%", borderRadius: 10, width: `${p * g}%`, minWidth: g > 0 ? 3 : 0, background: first ? C.brand600 : "rgb(122 128 124 / 0.5)" }} />
                </span>
                <span style={{ textAlign: "right", fontSize: 14, fontWeight: first ? 600 : 400, color: first ? C.ink : C.inkMuted, fontVariantNumeric: "tabular-nums" }}>
                  {(p * g).toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 8, padding: "0 8px", fontSize: 12, lineHeight: "19px", color: C.inkSubtle }}>
          Scores show how strongly the model favours each category. They are not a guarantee. Computed on your device in {s.ms} ms.
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", gap: 10 }}>
        <Btn variant="primary" hover={hoverClassify} style={{ flex: 1, height: 48, fontSize: 15 }}>
          <RotateCcw size={16} /> Classify Another
        </Btn>
        <Btn variant="secondary" style={{ flex: 1, height: 48, fontSize: 15 }}>
          Learn About This Category <ArrowDownRight size={16} />
        </Btn>
      </div>
    </div>
  );
};

const Classifier: React.FC<{ t: number; cursor: { x: number; y: number }; pressed: boolean; scroll: number }> = ({ t, cursor, pressed, scroll }) => {
  const st = uiState(t);
  const showing = st.phase === "picker" ? st.under : st.phase;
  const run = st.phase === "picker" ? st.underRun : st.run;
  const since = st.phase === "picker" ? (st.underRun ? t - st.underRun.resultIn : 0) : st.since;

  const px = cursor.x;
  const py = cursor.y + scroll;
  const inRect = (r: { x: number; y: number; w: number; h: number }) => px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
  const hoverDrop = inRect(DROP);
  const hoverReplace = Math.abs(px - 623) < 55 && Math.abs(py - (DROP.y + DROP.h - 40)) < 20;
  const hoverAnalyze = Math.abs(px - 1115) < 253 && Math.abs(py - (RESULT_PANEL.y + 32 + 144)) < 24;
  const hoverClassifyAnother = Math.abs(px - 990) < 120 && Math.abs(py - (RESULT_PANEL.y + RESULT_PANEL.h - 32 - 24)) < 24;

  return (
    <div
      style={{
        position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: 24, border: `1px solid ${C.line}`,
        background: C.surface, boxShadow: SHADOW_RAISED, overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 112, borderBottom: `1px solid ${C.line}` }}>
        <div style={{ position: "absolute", left: 32, top: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, color: C.brand700, textTransform: "uppercase" }}>Waste Classifier</div>
          <div style={{ marginTop: 6, fontSize: 28, fontWeight: 700, letterSpacing: -0.5, color: C.ink, lineHeight: "34px" }}>Upload Waste Image</div>
          <div style={{ marginTop: 4, fontSize: 16, color: C.inkMuted }}>Upload a clear image of a single waste item for classification.</div>
        </div>
        <div style={{ position: "absolute", right: 32, top: 42, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.inkSubtle }}>
            <Lock size={14} /> Processed in your browser, never uploaded
          </div>
          <ModelBadge />
        </div>
      </div>

      {showing === "empty" ? (
        <Dropzone hover={hoverDrop} pressed={pressed && hoverDrop} />
      ) : (
        run && (
          <Preview
            run={run} phase={showing as "selected" | "classifying" | "result"}
            since={showing === "result" ? t - run.resultIn : showing === "selected" ? t - run.imageIn : t - run.analyzeClick}
            t={t} hoverReplace={hoverReplace} replacePressed={pressed && hoverReplace}
          />
        )
      )}

      <div style={{ position: "absolute", left: 790, top: 112, width: RESULT_PANEL.w, height: RESULT_PANEL.h, background: C.canvas, borderLeft: `1px solid ${C.line}` }}>
        {showing === "result" && run ? (
          <Result run={run} since={since} hoverClassify={hoverClassifyAnother} />
        ) : (
          <Placeholder state={showing === "empty" ? "empty" : (showing as "selected" | "classifying")} t={t} hoverAnalyze={hoverAnalyze} pressed={pressed && hoverAnalyze} />
        )}
      </div>
    </div>
  );
};

/* ------------------------------ File picker ------------------------------ */

export const PICKER = { x: 400, y: 170, w: 640, h: 470 } as const;

const FilePicker: React.FC<{ t: number; rowClickT: number; open: number; close: number; photo: Run["photo"] }> = ({ t, rowClickT, open, close, photo }) => {
  const inP = easeOut(clamp01((t - open) / 0.12));
  const outP = 1 - clamp01((t - (close - 0.08)) / 0.08);
  const o = Math.min(inP, outP);
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 60, background: `rgb(10 20 14 / ${0.3 * o})` }}>
      <div
        style={{
          position: "absolute", left: PICKER.x, top: PICKER.y, width: PICKER.w, height: PICKER.h, borderRadius: 14, background: "#fff",
          boxShadow: "0 30px 80px rgb(0 0 0 / 0.35)", opacity: o, transform: `scale(${0.96 + 0.04 * inP})`, overflow: "hidden", fontFamily: FONT,
        }}
      >
        <div style={{ height: 52, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 8, background: "#f7f7f5" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 12, height: 12, borderRadius: 12, background: c }} />)}
          <span style={{ marginLeft: 12, fontSize: 14, fontWeight: 600, color: C.ink }}>Open — Choose a waste image</span>
        </div>
        <div style={{ padding: "8px 12px" }}>
          {PICKER_FILES.map((id) => {
            const s = SAMPLES[id];
            const selected = id === photo && t >= rowClickT;
            return (
              <div
                key={id}
                style={{
                  height: 48, borderRadius: 8, display: "flex", alignItems: "center", gap: 14, padding: "0 12px",
                  background: selected ? "#dbe9ff" : "transparent",
                }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 6, overflow: "hidden", border: `1px solid ${C.line}` }}><Photo id={id} /></div>
                <span style={{ fontSize: 14, fontWeight: 500, color: C.ink, flex: 1 }}>{s.file}</span>
                <span style={{ fontSize: 12, color: C.inkSubtle }}>{s.size.split(" · ")[0]}</span>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", right: 16, bottom: 12, display: "flex", gap: 10 }}>
          <div style={{ height: 34, width: 84, borderRadius: 8, border: `1px solid ${C.lineStrong}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: C.ink }}>Cancel</div>
          <div style={{ height: 34, width: 84, borderRadius: 8, background: "#2f6fe4", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600 }}>Open</div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------ Highlights ------------------------------- */

/** Pulsing ring used to draw the eye to a region (page coordinates). */
export const Highlight: React.FC<{ x: number; y: number; w: number; h: number; progress: number; radius?: number }> = ({ x, y, w, h, progress, radius = 20 }) => {
  const a = Math.sin(Math.PI * clamp01(progress));
  if (a <= 0.001) return null;
  const pulse = 0.5 + 0.5 * Math.sin(progress * Math.PI * 6);
  return (
    <div
      style={{
        position: "absolute", left: x - 8, top: y - 8, width: w + 16, height: h + 16, borderRadius: radius + 8, pointerEvents: "none",
        border: `3px solid ${C.brand500}`, opacity: Math.min(1, a * 1.6),
        boxShadow: `0 0 0 ${4 + pulse * 8}px rgb(47 154 82 / ${0.12 + 0.1 * pulse}), 0 0 40px rgb(47 154 82 / 0.35)`,
      }}
    />
  );
};

/** Draw-on check mark beside the final prediction (page coordinates). */
const FinalCheck: React.FC<{ t: number }> = ({ t }) => {
  const final = RUNS[RUNS.length - 1];
  const d = t - final.resultIn - 0.35;
  if (d < 0 || t > final.end + 1) return null;
  const circle = easeOut(clamp01(d / 0.45));
  const tick = easeOut(clamp01((d - 0.25) / 0.35));
  const pop = 1 + 0.18 * Math.sin(Math.PI * clamp01((d - 0.55) / 0.5));
  const burst = easeOut(clamp01((d - 0.45) / 0.6));
  return (
    <div style={{ position: "absolute", left: 1040, top: 972, width: 52, height: 52, transform: `scale(${pop})` }}>
      <div style={{ position: "absolute", inset: -8, borderRadius: 60, border: `3px solid ${C.brand500}`, opacity: (1 - burst) * (burst > 0 ? 1 : 0), transform: `scale(${1 + burst * 0.9})` }} />
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r="23" fill={`rgb(47 154 82 / ${0.12 * tick})`} stroke={C.brand500} strokeWidth="3.5" strokeLinecap="round"
          strokeDasharray={145} strokeDashoffset={145 * (1 - circle)} transform="rotate(-90 26 26)" />
        <path d="M15 27 L23 35 L38 18" fill="none" stroke={C.brand600} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={42} strokeDashoffset={42 * (1 - tick)} />
      </svg>
    </div>
  );
};

/* -------------------------------- Page root ------------------------------ */

export interface AppPageProps {
  t: number;
  cursor: { x: number; y: number; pressed: number };
  highlights: { x: number; y: number; w: number; h: number; progress: number }[];
}

export const AppPage: React.FC<AppPageProps> = ({ t, cursor, highlights }) => {
  const scroll = scrollY(t);
  const st = uiState(t);
  const pressed = cursor.pressed > 0.3;
  // Once the camera has zoomed past the header, fade it rather than leaving a sliver at the edge.
  const headerOpacity = interpolate(cameraAt(t).ty, [-26, -4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const heroCtaHover = scroll < 40 && Math.abs(cursor.x - 134) < 95 && Math.abs(cursor.y - 513) < 26;
  const tryHover = Math.abs(cursor.x - 1326) < 80 && Math.abs(cursor.y - 32) < 20;

  let picker: React.ReactNode = null;
  if (st.phase === "picker" && st.picking) {
    const r = st.picking;
    const dur = r.imageIn - r.pickerOpen;
    const rowClickT = r.pickerOpen + dur * (dur > 1 ? 0.38 : 0.55);
    picker = <FilePicker t={t} rowClickT={rowClickT} open={r.pickerOpen} close={r.imageIn} photo={r.photo} />;
  }

  return (
    <div style={{ position: "absolute", inset: 0, width: VIEW_W, height: VIEW_H, overflow: "hidden", background: C.canvas, fontFamily: FONT, color: C.ink }}>
      <div style={{ position: "absolute", left: 0, top: -scroll, width: VIEW_W, height: CARD.y + CARD.h + 64 }}>
        <Hero t={t} hoverCta={heroCtaHover} ctaPressed={pressed && heroCtaHover} />
        <Classifier t={t} cursor={cursor} pressed={pressed} scroll={scroll} />
        {highlights.map((h, i) => <Highlight key={i} {...h} />)}
        <FinalCheck t={t} />
      </div>
      <div style={{ opacity: headerOpacity }}><Header scroll={scroll} hoverCta={tryHover} /></div>
      {picker}
    </div>
  );
};

export { SCROLL_TARGET, interpolate };

