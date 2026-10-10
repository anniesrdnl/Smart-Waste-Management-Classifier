import React from "react";
import { Composition } from "remotion";
import { DURATION_S, FPS, STAGE_H, STAGE_W } from "./theme";
import { Promo } from "./Promo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Promo"
      component={Promo}
      durationInFrames={DURATION_S * FPS}
      fps={FPS}
      width={STAGE_W}
      height={STAGE_H}
    />
  );
};
