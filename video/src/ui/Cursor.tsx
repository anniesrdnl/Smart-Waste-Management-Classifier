import React from "react";
import { Easing } from "remotion";
import { C } from "../theme";
import { CLICK_POINTS, type CursorPose } from "../timeline";

/** Mouse pointer with a soft halo and click ripples, drawn in app-viewport coordinates. */
export const Cursor: React.FC<{ t: number; pose: CursorPose }> = ({ t, pose }) => {
  if (pose.visible <= 0.01) return null;
  const press = pose.pressed;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 100, opacity: pose.visible }}>
      {CLICK_POINTS.map((c, i) => {
        const d = t - c.t;
        if (d < 0 || d > 0.55) return null;
        const p = Easing.out(Easing.cubic)(d / 0.55);
        const click = c;
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: click.x, top: click.y, width: 12, height: 12, borderRadius: 999,
              border: `3px solid ${C.brand500}`, opacity: 1 - p, transform: `translate(-50%, -50%) scale(${1 + p * 4.5})`,
              transformOrigin: "center", pointerEvents: "none",
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute", left: pose.x, top: pose.y, width: 46, height: 46, marginLeft: -23, marginTop: -23, borderRadius: 999,
          background: "rgb(47 154 82 / 0.16)", border: "1.5px solid rgb(47 154 82 / 0.35)", transform: `scale(${1 - press * 0.25})`,
        }}
      />
      <svg
        width="30" height="34" viewBox="0 0 24 28"
        style={{
          position: "absolute", left: pose.x - 3, top: pose.y - 2, transform: `scale(${1 - press * 0.14})`, transformOrigin: "4px 3px",
          filter: "drop-shadow(0 2px 3px rgb(0 0 0 / 0.35))",
        }}
      >
        <path d="M4 2 L4 21 L9 16.6 L12.4 24.2 L15.6 22.8 L12.3 15.4 L19 15.2 Z" fill="#fff" stroke="#111" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
