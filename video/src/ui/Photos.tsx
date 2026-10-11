import React from "react";
import { Img, staticFile } from "remotion";
import { SAMPLES, type PhotoId } from "../timeline";

/** One of the test photos from public/samples. */
export const Photo: React.FC<{ id: PhotoId; fit?: "cover" | "contain" }> = ({ id, fit = "cover" }) => (
  <Img src={staticFile(SAMPLES[id].src)} style={{ width: "100%", height: "100%", objectFit: fit, display: "block" }} />
);
