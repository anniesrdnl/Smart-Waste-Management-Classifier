export const WASTE_CLASS_IDS = ["cardboard", "glass", "metal", "paper", "plastic", "trash"] as const;

export type WasteClassId = (typeof WASTE_CLASS_IDS)[number];

export function isWasteClassId(value: unknown): value is WasteClassId {
  return typeof value === "string" && (WASTE_CLASS_IDS as readonly string[]).includes(value);
}
