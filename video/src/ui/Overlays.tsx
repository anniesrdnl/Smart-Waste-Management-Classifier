import React from "react";
import { Easing, interpolate } from "remotion";
import { Check, ChevronRight, Cylinder, Milk, Newspaper, Package, ScanSearch, Trash2, Upload, Wine, Zap, type LucideIcon } from "lucide-react";
import { C, FONT, STAGE_W } from "../theme";
import { CAPTIONS, CLASS_ORDER, LABEL, RUNS, SAMPLES, type ClassId } from "../timeline";

const ICONS: Record<ClassId, LucideIcon> = { cardboard: Package, glass: Wine, metal: Cylinder, paper: Newspaper, plastic: Milk, trash: Trash2 };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const back = Easing.out(Easing.back(1.8));
const out = Easing.out(Easing.cubic);

/** 0→1 in, hold, 1→0 out. */
function presence(t: number, from: number, to: number, inD = 0.35, outD = 0.25) {
  return {
    inP: interpolate(t, [from, from + inD], [0, 1], clamp),
    vis: interpolate(t, [from, from + inD, to - outD, to], [0, 1, 1, 0], clamp),
  };
}

const PILL_BG = "rgb(9 28 17 / 0.94)";
const pill: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 14, height: 56, padding: "0 26px", borderRadius: 999, background: PILL_BG, color: "#fff",
  boxShadow: "0 10px 30px rgb(9 28 17 / 0.28), inset 0 0 0 1px rgb(127 227 154 / 0.25)", whiteSpace: "nowrap",
};

const TopSlot: React.FC<{ t: number; from: number; to: number; children: React.ReactNode }> = ({ t, from, to, children }) => {
  const { inP, vis } = presence(t, from, to);
  if (vis <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 8, width: STAGE_W, display: "flex", justifyContent: "center", gap: 18, opacity: vis, transform: `translateY(${(1 - back(inP)) * -22}px) scale(${0.92 + 0.08 * back(inP)})` }}>
      {children}
    </div>
  );
};

const StepChip: React.FC<{ n: string }> = ({ n }) => (
  <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2.5, color: C.dark, background: "#7fe39a", borderRadius: 999, padding: "5px 14px" }}>{n}</span>
);

/* ---------------------------- Top-zone captions --------------------------- */

const FlowPill: React.FC<{ t: number }> = ({ t }) => {
  const steps: { icon: LucideIcon; label: string; at: number }[] = [
    { icon: Upload, label: "Upload", at: 5.5 },
    { icon: ScanSearch, label: "Analyze", at: 7.6 },
    { icon: Check, label: "Classify", at: 9.4 },
  ];
  return (
    <div style={{ ...pill, gap: 10, height: 60, padding: "0 18px" }}>
      {steps.map((s, i) => {
        const on = t >= s.at;
        const k = out(interpolate(t, [s.at, s.at + 0.35], [0, 1], clamp));
        const I = s.icon;
        return (
          <React.Fragment key={s.label}>
            {i > 0 && <ChevronRight size={22} color="#7fe39a" style={{ opacity: 0.4 + 0.6 * k }} />}
            <span
              style={{
                display: "inline-flex", alignItems: "center", gap: 10, fontSize: 26, fontWeight: 700, padding: "6px 16px", borderRadius: 999,
                background: on ? `rgb(127 227 154 / ${0.16 + 0.1 * k})` : "transparent", color: on ? "#bff5cf" : "rgb(255 255 255 / 0.55)",
                transform: `scale(${1 + 0.06 * Math.sin(Math.PI * Math.min(1, (t - s.at) / 0.5)) * (on ? 1 : 0)})`,
              }}
            >
              <I size={24} /> {s.label}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Tracker: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ ...pill, gap: 10, height: 60, padding: "0 14px" }}>
    {CLASS_ORDER.map((id) => {
      const run = RUNS.find((r) => SAMPLES[r.photo].cls === id);
      const doneAt = run ? run.resultIn : 999;
      const done = t >= doneAt;
      const k = back(interpolate(t, [doneAt, doneAt + 0.4], [0, 1], clamp));
      const I = ICONS[id];
      return (
        <span
          key={id}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, fontSize: 20, fontWeight: 700, padding: "7px 14px", borderRadius: 999,
            background: done ? "rgb(127 227 154 / 0.22)" : "rgb(255 255 255 / 0.06)", color: done ? "#c9f8d6" : "rgb(255 255 255 / 0.5)",
            transform: `scale(${done ? 1 + 0.12 * Math.sin(Math.PI * Math.min(1, (t - doneAt) / 0.45)) : 1})`,
          }}
        >
          <I size={20} /> {LABEL[id]}
          <span style={{ width: 22, height: 22, borderRadius: 22, background: done ? "#4fd07a" : "transparent", border: done ? "none" : "1.5px solid rgb(255 255 255 / 0.25)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${done ? k : 1})` }}>
            {done && <Check size={14} strokeWidth={3.5} color={C.dark} />}
          </span>
        </span>
      );
    })}
  </div>
);

/* --------------------------- Classification pop-up ------------------------ */

const ResultPop: React.FC<{ t: number }> = ({ t }) => {
  const nodes = RUNS.map((r, i) => {
    const s = SAMPLES[r.photo];
    const hold = i === 0 ? 2.8 : i === RUNS.length - 1 ? 0 : Math.min(1.35, r.end - r.resultIn - 0.05);
    if (hold <= 0) return null; // the final run uses the check-mark callouts instead
    const to = r.resultIn + hold;
    const { inP, vis } = presence(t, r.resultIn + 0.04, to, 0.32, 0.22);
    if (vis <= 0.001) return null;
    const k = back(inP);
    const I = ICONS[s.cls];
    return (
      <div
        key={i}
        style={{
          position: "absolute", left: 960 - 260, top: 215, width: 520, display: "flex", justifyContent: "center", opacity: vis,
          transform: `scale(${0.7 + 0.3 * k}) translateY(${(1 - k) * 18}px)`,
        }}
      >
        <div style={{ ...pill, height: 96, gap: 18, padding: "0 34px", background: "rgb(255 255 255 / 0.96)", color: C.ink, boxShadow: "0 20px 50px rgb(9 28 17 / 0.28), inset 0 0 0 2px #2f9a52" }}>
          <span style={{ width: 54, height: 54, borderRadius: 16, background: C.brand600, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <I size={30} color="#fff" />
          </span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
            <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: 1, color: C.ink }}>{LABEL[s.cls].toUpperCase()}</span>
            <span style={{ fontSize: 20, fontWeight: 600, color: C.brand700 }}>Confidence: {s.probs[0][1].toFixed(1)}%</span>
          </span>
          <span style={{ width: 46, height: 46, borderRadius: 46, background: "#2f9a52", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${back(interpolate(t, [r.resultIn + 0.25, r.resultIn + 0.6], [0, 1], clamp))})` }}>
            <Check size={28} strokeWidth={3.5} color="#fff" />
          </span>
        </div>
      </div>
    );
  });
  return <>{nodes}</>;
};

/* -------------------------------- Subtitles -------------------------------- */

const Subtitles: React.FC<{ t: number }> = ({ t }) => {
  const cap = CAPTIONS.find((c) => t >= c.from && t <= c.to);
  if (!cap) return null;
  const inP = out(interpolate(t, [cap.from, cap.from + 0.25], [0, 1], clamp));
  const outP = interpolate(t, [cap.to - 0.2, cap.to], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, bottom: 20, width: STAGE_W, display: "flex", justifyContent: "center", opacity: Math.min(inP, outP), transform: `translateY(${(1 - inP) * 10}px)` }}>
      <div
        style={{
          maxWidth: 1560, textAlign: "center", fontFamily: FONT, fontSize: 28, fontWeight: 600, lineHeight: "37px", color: "#fff", background: "rgb(9 28 17 / 0.9)",
          padding: "8px 28px", borderRadius: 18,
        }}
      >
        {cap.text}
      </div>
    </div>
  );
};

/* ----------------------------------- Root --------------------------------- */

export const Overlays: React.FC<{ t: number; hidden: boolean }> = ({ t, hidden }) => {
  if (hidden) return null;
  const purpose = [
    { from: 42.3, to: 45.2, icon: Package, text: "6 WASTE CATEGORIES" },
    { from: 45.2, to: 48.2, icon: ScanSearch, text: "COMPUTER VISION POWERED" },
    { from: 48.2, to: 51.0, icon: Zap, text: "FAST & EASY CLASSIFICATION" },
  ];
  const final = RUNS[RUNS.length - 1];

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT }}>
      <TopSlot t={t} from={2.9} to={5.0}>
        <div style={{ ...pill, fontSize: 26, fontWeight: 700, letterSpacing: 0.5 }}>
          <span style={{ width: 12, height: 12, borderRadius: 12, background: "#4fd07a" }} /> AI-Powered Waste Identification
        </div>
      </TopSlot>
      <TopSlot t={t} from={5.3} to={10.9}><FlowPill t={t} /></TopSlot>
      <TopSlot t={t} from={11.3} to={19.8}>
        <div style={{ ...pill, fontSize: 28, fontWeight: 700 }}><StepChip n="STEP 1" /> Upload a waste image</div>
      </TopSlot>
      <TopSlot t={t} from={20.1} to={28.8}>
        <div style={{ ...pill, fontSize: 28, fontWeight: 700 }}><StepChip n="STEP 2" /> AI analyzes the image</div>
      </TopSlot>
      <TopSlot t={t} from={29.1} to={41.9}><Tracker t={t} /></TopSlot>
      {purpose.map((p) => (
        <TopSlot key={p.text} t={t} from={p.from} to={p.to}>
          <div style={{ ...pill, fontSize: 30, fontWeight: 800, letterSpacing: 2, height: 60 }}>
            <p.icon size={28} color="#7fe39a" /> {p.text}
          </div>
        </TopSlot>
      ))}
      <TopSlot t={t} from={final.imageIn + 0.2} to={57.0}>
        <div style={{ ...pill, fontSize: 28, fontWeight: 800, letterSpacing: 1.5 }}>
          <Check size={28} strokeWidth={3.5} color="#7fe39a" /> IMAGE DETECTED
        </div>
        {t >= final.resultIn + 0.1 && (
          <div style={{ ...pill, fontSize: 28, fontWeight: 800, letterSpacing: 1.5, transform: `scale(${0.8 + 0.2 * back(interpolate(t, [final.resultIn + 0.1, final.resultIn + 0.5], [0, 1], clamp))})`, opacity: interpolate(t, [final.resultIn + 0.1, final.resultIn + 0.4], [0, 1], clamp) }}>
            <Check size={28} strokeWidth={3.5} color="#7fe39a" /> WASTE CLASSIFIED
          </div>
        )}
      </TopSlot>
      <ResultPop t={t} />
      <Subtitles t={t} />
    </div>
  );
};
