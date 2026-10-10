import React from "react";
import { AbsoluteFill, Easing, Html5Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, FONT, FPS, STAGE_H, STAGE_W, VOICEOVER_FILE, sec } from "./theme";
import { CARD, CLICKS, DROP, RESULT_PANEL, RUNS, SAMPLES, VIEW_H, VIEW_W, cameraAt, cursorAt } from "./timeline";
import { AppPage } from "./ui/AppPage";
import { BrandCard } from "./ui/BrandCard";
import { Cursor } from "./ui/Cursor";
import { Overlays } from "./ui/Overlays";
import { Lock } from "lucide-react";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Browser window placement on the 1920×1080 stage.
const SC = 1.04;
const WIN_W = VIEW_W * SC;
const BAR_H = 44;
const WIN_X = (STAGE_W - WIN_W) / 2;
const WIN_Y = 76;
const WIN_H = BAR_H + VIEW_H * SC;

const Browser: React.FC<{ t: number }> = ({ t }) => {
  const cam = cameraAt(t);
  const cursor = cursorAt(t);
  const last = RUNS[RUNS.length - 1];

  // "Highlight the upload section" (7.4–10.6) and the workflow beats in the purpose section (42–51).
  const prog = (a: number, b: number) => (t - a) / (b - a);
  const highlights = [
    { x: DROP.x, y: DROP.y, w: DROP.w, h: DROP.h, progress: prog(7.4, 10.8) },
    { x: DROP.x, y: DROP.y, w: DROP.w, h: DROP.h, progress: prog(42.6, 45.0) },
    { x: RESULT_PANEL.x, y: RESULT_PANEL.y, w: RESULT_PANEL.w, h: RESULT_PANEL.h, progress: prog(45.2, 47.6) },
    { x: CARD.x, y: CARD.y, w: CARD.w, h: CARD.h, progress: prog(47.8, 50.8) },
  ].filter((h) => h.progress > 0 && h.progress < 1);
  void last;

  return (
    <div
      style={{
        position: "absolute", left: WIN_X, top: WIN_Y, width: WIN_W, height: WIN_H, borderRadius: 18, overflow: "hidden", background: "#fff",
        boxShadow: "0 40px 100px rgb(9 40 22 / 0.28), 0 0 0 1px rgb(9 40 22 / 0.12)",
      }}
    >
      <div style={{ height: BAR_H, background: "#eef0ec", borderBottom: "1px solid #dfe3dc", display: "flex", alignItems: "center", padding: "0 16px", gap: 8 }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 13, height: 13, borderRadius: 13, background: c }} />)}
        <div style={{ margin: "0 auto", transform: "translateX(-30px)", width: 420, height: 28, borderRadius: 14, background: "#fff", border: "1px solid #dfe3dc", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: FONT, fontSize: 14, color: C.inkMuted }}>
          <Lock size={13} /> smartwaste-cv.vercel.app
        </div>
      </div>
      <div style={{ position: "relative", width: WIN_W, height: VIEW_H * SC, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: VIEW_W, height: VIEW_H, transformOrigin: "0 0", transform: `scale(${SC})` }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: VIEW_W, height: VIEW_H, transformOrigin: "0 0", transform: `translate(${cam.tx}px, ${cam.ty}px) scale(${cam.s})` }}>
            <AppPage t={t} cursor={cursor} highlights={highlights} />
            <Cursor t={t} pose={cursor} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Sfx: React.FC = () => {
  const play = (src: string, at: number, volume: number, key: string, len = 60) => (
    <Sequence key={key} from={sec(at)} durationInFrames={len} layout="none">
      <Html5Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
    </Sequence>
  );
  const final = RUNS[RUNS.length - 1];
  return (
    <>
      {[0.25, 2.45, 5.75, 42.4, 57.0].map((a) => play("whoosh", a, 0.32, `w${a}`))}
      {CLICKS.map((c, i) => play("click", c - 0.02, 0.55, `c${i}`, 12))}
      {RUNS.map((r, i) => play("pop", r.resultIn, 0.45, `p${i}`, 20))}
      {play("success", RUNS[0].resultIn + 0.25, 0.5, "s0", 40)}
      {play("success", final.resultIn + 0.4, 0.55, "s1", 40)}
      {play("scan", RUNS[0].analyzeClick, 0.28, "scan0", 55)}
      {play("scan", final.analyzeClick, 0.28, "scan1", 55)}
    </>
  );
};

export const Promo: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  // Stage entrance after the title card (2.2–3.1s) and exit to the end card (57.0–57.7s).
  const stageIn = Easing.out(Easing.cubic)(interpolate(t, [2.2, 3.1], [0, 1], clamp));
  const introOut = interpolate(t, [2.45, 3.1], [1, 0], clamp);
  const introScale = 1 + 0.07 * Easing.in(Easing.quad)(interpolate(t, [2.45, 3.1], [0, 1], clamp));
  const endIn = Easing.inOut(Easing.cubic)(interpolate(t, [57.0, 57.7], [0, 1], clamp));
  const stageScale = (0.93 + 0.07 * stageIn) * (1 - 0.04 * endIn);

  return (
    <AbsoluteFill style={{ background: "#e9f1ea", overflow: "hidden", fontFamily: FONT }}>
      {/* Stage backdrop */}
      <AbsoluteFill style={{ background: "linear-gradient(135deg, #e4f0e6 0%, #f6f8f2 55%, #dcebdf 100%)" }}>
        <div style={{ position: "absolute", left: -240, top: -260, width: 760, height: 760, borderRadius: 999, background: "rgb(47 154 82 / 0.22)", filter: "blur(120px)" }} />
        <div style={{ position: "absolute", right: -200, bottom: -300, width: 820, height: 820, borderRadius: 999, background: "rgb(132 200 150 / 0.35)", filter: "blur(130px)" }} />
      </AbsoluteFill>

      <div style={{ position: "absolute", inset: 0, opacity: stageIn, transform: `scale(${stageScale})`, transformOrigin: "50% 50%" }}>
        {t > 2.1 && <Browser t={t} />}
        <Overlays t={t} hidden={t > 57.0} />
      </div>

      <BrandCard local={t} tagline="AI-Powered Waste Identification" opacity={introOut} scale={introScale} />
      <BrandCard local={t - 57.0} tagline="Classify Smarter. Manage Waste Better." opacity={endIn} titleAt={0.45} taglineAt={1.0} />

      {/* Subtitles stay on top of the end card too */}
      {t > 57.0 && <EndCaption t={t} />}

      <Sfx />
      {VOICEOVER_FILE && <Html5Audio src={staticFile(VOICEOVER_FILE)} />}
    </AbsoluteFill>
  );
};

const EndCaption: React.FC<{ t: number }> = ({ t }) => {
  const a = interpolate(t, [57.4, 57.8, 59.7, 60], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, bottom: 20, width: STAGE_W, display: "flex", justifyContent: "center", opacity: a }}>
      <div style={{ maxWidth: 1560, textAlign: "center", fontFamily: FONT, fontSize: 28, fontWeight: 600, lineHeight: "37px", color: "#fff", background: "rgb(255 255 255 / 0.1)", border: "1px solid rgb(255 255 255 / 0.18)", padding: "9px 30px", borderRadius: 18, backdropFilter: "blur(8px)" }}>
        Smart Waste Management Classifier. Classify smarter, manage waste better.
      </div>
    </div>
  );
};

export { SAMPLES, STAGE_H };
