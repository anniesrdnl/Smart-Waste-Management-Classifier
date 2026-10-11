# SmartWaste promo video (Remotion)

A 60-second, 1920×1080, 30 fps product demo of the Smart Waste Management Classifier.
The app UI is re-created in React using the real app's colours, copy and layout, so every cursor move,
zoom and classification is deterministic and re-renderable.

```bash
cd video
npm install
npm run dev                      # Remotion Studio
npx remotion render Promo out/smart-waste-promo.mp4
```

## Timeline (all in `src/timeline.ts`)

| Time | Beat |
|---|---|
| 0:00–0:05 | Logo + title card → homepage, slight zoom |
| 0:05–0:11 | Click *Classify Waste*, scroll to the classifier, highlight the upload area · "Upload → Analyze → Classify" |
| 0:11–0:20 | STEP 1 — file picker, plastic image appears in the preview |
| 0:20–0:29 | STEP 2 — Analyze, loading sweep, **Plastic 98.7%**, zoom to the result |
| 0:29–0:42 | Quick cuts: cardboard → glass → metal → paper → trash, each with a pop-up + tracker |
| 0:42–0:51 | Pull back, highlight upload / result / workflow · 6 WASTE CATEGORIES · COMPUTER VISION POWERED · FAST & EASY CLASSIFICATION |
| 0:51–0:57 | Final upload → Analyze → prediction + animated check · IMAGE DETECTED ✓ / WASTE CLASSIFIED ✓ |
| 0:57–1:00 | Fade to logo end card · "Classify Smarter. Manage Waste Better." |

To retime a beat, edit `RUNS` (upload/analyze/result times), `CAPTIONS`, or the `CAM` camera keyframes.

## Voice-over

No narration audio is included — record these lines and save the file as `public/voiceover.mp3`, then set
`VOICEOVER_FILE = "voiceover.mp3"` in `src/theme.ts`. The on-screen subtitles already match the timings below.

| Start | Line |
|---|---|
| 0:00 | Can artificial intelligence help us identify waste in just seconds? |
| 0:05 | Our Smart Waste Management Classifier uses computer vision to identify different types of waste from uploaded images. |
| 0:11 | To begin, the user simply uploads an image of the waste they want to identify. |
| 0:20 | The trained model analyzes the image and predicts its waste category, together with its confidence score. |
| 0:29 | The system can classify six waste categories: cardboard, glass, metal, paper, plastic, and trash. |
| 0:42 | This provides users with a simple and accessible way to recognize different waste materials and support proper waste classification. |
| 0:51 | One image, one prediction, and a smarter approach to understanding waste. |
| 0:57 | Smart Waste Management Classifier. Classify smarter, manage waste better. |

## Assets

- `public/logo.png` — copied from the app's `public/logo.png`.
- `public/fonts/` — Geist (same typeface as the app), bundled so rendering works offline.
- `public/sfx/*.wav` — synthesized click / pop / whoosh / chime / scan sounds (placed per click and result in `Promo.tsx`).
- `public/samples/*.jpg` — your real test photos (cardboard, glass, metal, paper). Plastic and the "general waste"
  cut still use illustrations from `src/ui/Photos.tsx` (no plastic photo was supplied).

## Note on the numbers

The video is a scripted re-creation, not a screen capture. In `SAMPLES` (`src/timeline.ts`):

- `real: true` — cardboard 99.49%, glass 98.94%, metal 91.25%, paper 99.18%. These come from running the repo's
  `public/model/smart_waste_mobilenetv2.onnx` on the exact photo with the app's own resampler (`lib/preprocess.ts`).
  The metal result matches the screenshot in `docs/screenshot-classifier.png` digit for digit.
- `real: false` — plastic (98.7%, 97.6%) and the illustrated trash bag (89.5%) are illustrative.

`trash_bins.jpg` (overflowing bins) is wired up as `SAMPLES.bins`, but the real model classifies it as **Plastic 93.33%**
(Trash 2.94%), so the video uses the illustrated bag for the trash cut. Change `TRASH_PHOTO` to `"bins"` to show the real
result instead, or add a photo the model classifies as trash.
