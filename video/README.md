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
- `src/ui/Photos.tsx` — the seven "uploaded photos" are **illustrations**. To use real photos, render
  `<Img src={staticFile("samples/…jpg")} />` in `Photo` instead.

## Note on the numbers

The video is a scripted re-creation, not a screen capture of the live model. The confidence values shown
(98.7%, 96.4%, …) are illustrative and defined in `SAMPLES` in `src/timeline.ts`. For evidence-grade footage,
screen-record the real app and use this project for the overlays, subtitles and end cards.
