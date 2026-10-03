import type { WasteClassId } from "./classes";

export type Recyclability = "recyclable" | "conditional" | "residual";

export interface WasteInfo {
  label: string;
  description: string;
  recyclability: Recyclability;
  recyclabilityLabel: string;
  summary: string;
  guidance: string[];
}

export const WASTE_INFO: Record<WasteClassId, WasteInfo> = {
  cardboard: {
    label: "Cardboard",
    description: "Corrugated boxes, cartons and thick packaging board.",
    recyclability: "recyclable",
    recyclabilityLabel: "Generally recyclable",
    summary: "Cardboard is generally recyclable when it is clean and dry.",
    guidance: [
      "Flatten boxes to save space in the collection bin.",
      "Keep it dry — wet or greasy cardboard, such as used pizza boxes, is often not accepted.",
      "Remove tape, plastic film and packing materials where practical.",
    ],
  },
  glass: {
    label: "Glass",
    description: "Bottles, jars and other glass containers.",
    recyclability: "conditional",
    recyclabilityLabel: "Often recyclable",
    summary: "Glass bottles and jars are often recyclable, depending on the glass type and local facilities.",
    guidance: [
      "Empty and rinse bottles and jars before recycling.",
      "Remove lids and caps; they are usually collected separately.",
      "Window glass, mirrors, drinking glasses and ceramics are often not accepted with container glass.",
      "Wrap broken glass carefully before disposal to protect waste workers.",
    ],
  },
  metal: {
    label: "Metal",
    description: "Aluminium and steel cans, tins and foil.",
    recyclability: "recyclable",
    recyclabilityLabel: "Commonly recyclable",
    summary: "Metal waste such as aluminium and steel cans is commonly recyclable when cleaned and separated.",
    guidance: [
      "Rinse food and drink cans to remove residue.",
      "Keep metal separate from non-recyclable materials.",
      "Only recycle aerosol cans when they are completely empty and your local scheme accepts them.",
      "Take care with sharp edges on opened tins.",
    ],
  },
  paper: {
    label: "Paper",
    description: "Newspapers, office paper, magazines and envelopes.",
    recyclability: "recyclable",
    recyclabilityLabel: "Generally recyclable",
    summary: "Paper is generally recyclable when it is clean and free from major contamination.",
    guidance: [
      "Keep paper dry and free of food or grease.",
      "Waxed, laminated or heavily coated paper is often not accepted.",
      "Shredded paper may need to be bagged or handled separately — check local rules.",
    ],
  },
  plastic: {
    label: "Plastic",
    description: "Bottles, tubs, containers and packaging.",
    recyclability: "conditional",
    recyclabilityLabel: "Depends on type",
    summary: "Plastic recyclability depends heavily on the plastic type and on local facilities.",
    guidance: [
      "Check the resin identification code (the number in the recycling symbol).",
      "Empty and rinse bottles and containers.",
      "Plastic bags and soft films usually cannot go in household recycling; look for drop-off points.",
      "When unsure, follow your local authority's accepted-items list.",
    ],
  },
  trash: {
    label: "Trash",
    description: "Mixed, soiled or non-recyclable items for general waste.",
    recyclability: "residual",
    recyclabilityLabel: "Usually general waste",
    summary:
      "Items classified as general trash are usually mixed, contaminated or not commonly recyclable, and may require residual-waste disposal.",
    guidance: [
      "Dispose of it with general (residual) waste.",
      "Batteries, electronics, chemicals and medical waste need special collection — never put them in general waste.",
      "If part of the item is recyclable, separate it before disposal.",
    ],
  },
};

export const LOCAL_RULES_NOTICE =
  "Recycling rules differ between locations. Always check your local waste authority's guidelines before disposal.";
