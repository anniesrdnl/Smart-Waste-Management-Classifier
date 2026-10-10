import React from "react";
import { Easing, Img, interpolate, staticFile } from "remotion";
import { C, FONT, STAGE_H, STAGE_W } from "../theme";

const ease = Easing.out(Easing.cubic);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Dark logo card used for both the intro and the ending. `local` = seconds since the card started. */
export const BrandCard: React.FC<{
  local: number;
  tagline: string;
  opacity: number;
  scale?: number;
  titleAt?: number;
  taglineAt?: number;
}> = ({ local, tagline, opacity, scale = 1, titleAt = 0.55, taglineAt = 1.15 }) => {
  if (opacity <= 0.001) return null;
  const logoIn = ease(interpolate(local, [0, 0.9], [0, 1], clamp));
  const logoScale = 0.88 + 0.12 * ease(interpolate(local, [0, 2.6], [0, 1], clamp));
  const titleP = ease(interpolate(local, [titleAt, titleAt + 0.7], [0, 1], clamp));
  const tagP = ease(interpolate(local, [taglineAt, taglineAt + 0.6], [0, 1], clamp));
  const glow = 0.5 + 0.5 * Math.sin(local * 2.4);

  const words = "SMART WASTE MANAGEMENT CLASSIFIER".split(" ");

  return (
    <div
      style={{
        position: "absolute", inset: 0, width: STAGE_W, height: STAGE_H, background: `radial-gradient(ellipse at 50% 38%, #0b2616 0%, ${C.dark} 62%)`,
        opacity, transform: `scale(${scale})`, overflow: "hidden", fontFamily: FONT,
      }}
    >
      <div
        style={{
          position: "absolute", left: 960 - 520, top: 330 - 260, width: 1040, height: 520, borderRadius: 999, background: "rgb(80 190 90 / 0.18)",
          filter: "blur(90px)", opacity: 0.55 + glow * 0.3,
        }}
      />
      <Img
        src={staticFile("logo.png")}
        style={{
          position: "absolute", left: 960 - 360, top: 70, width: 720, height: 480, objectFit: "contain", mixBlendMode: "screen",
          opacity: logoIn, transform: `scale(${logoScale})`,
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", gap: 22 }}>
        {words.map((w, i) => {
          const p = ease(interpolate(local, [titleAt + i * 0.09, titleAt + i * 0.09 + 0.5], [0, 1], clamp));
          return (
            <span
              key={w}
              style={{
                fontSize: 62, fontWeight: 800, letterSpacing: 3, color: i === 1 ? "#7fe39a" : "#fff", opacity: p,
                transform: `translateY(${(1 - p) * 26}px)`, filter: `blur(${(1 - p) * 6}px)`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute", left: 0, right: 0, top: 750, textAlign: "center", fontSize: 34, fontWeight: 500, letterSpacing: 6,
          color: "#a7e8b8", textTransform: "uppercase", opacity: tagP, transform: `translateY(${(1 - tagP) * 14}px)`,
        }}
      >
        {tagline}
      </div>
      <div
        style={{
          position: "absolute", left: 960 - 90 * tagP, top: 830, width: 180 * tagP, height: 3, borderRadius: 3, background: "linear-gradient(90deg, transparent, #4fd07a, transparent)",
          opacity: titleP,
        }}
      />
      <span style={{ display: "none" }}>{titleP}</span>
    </div>
  );
};
