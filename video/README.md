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

The narration is an AI-generated female voice ([Kokoro](https://github.com/thewh1teagle/kokoro-onnx), voice `af_heart`,
Apache-2.0), one WAV per line in `public/narration/`. Start times and durations are in `src/narration.ts`, and the
subtitles are timed from the same data, so editing a line's `start` moves both. Two lines are sped up slightly
(1.1× and 1.2×) so the script fits the 60-second runtime; the closing line starts at 0:55.5 so it finishes before the end.

| Start | Line |
|---|---|
| 0:00.5 | Can artificial intelligence help us identify waste in just seconds? |
| 0:04.9 | Our Smart Waste Management Classifier uses computer vision to identify different types of waste from uploaded images. |
| 0:12 | To begin, the user simply uploads an image of the waste they want to identify. |
| 0:20 | The trained model analyzes the image and predicts its waste category, together with its confidence score. |
| 0:29 | The system can classify six waste categories: cardboard, glass, metal, paper, plastic, and trash. |
| 0:42 | This provides users with a simple and accessible way to recognize different waste materials and support proper waste classification. |
| 0:51 | One image, one prediction, and a smarter approach to understanding waste. |
| 0:55.5 | Smart Waste Management Classifier. Classify smarter, manage waste better. |

To re-voice it, replace the WAVs (or regenerate them with a different Kokoro voice) and update `NARRATION`.

## Assets

- `public/logo.png` — copied from the app's `public/logo.png`.
- `public/fonts/` — Geist (same typeface as the app), bundled so rendering works offline.
- `public/sfx/*.wav` — synthesized click / pop / whoosh / chime / scan sounds (placed per click and result in `Promo.tsx`).
- `public/samples/*.jpg` — the seven test photos, all real photographs (no AI-generated or edited images):
  - cardboard, glass, metal, paper — supplied by the project owner;
  - plastic (`plastic_bottle.jpg`, `plastic_jug.jpg`) and trash (`trash_wrapper.jpg`) — from the
    [TrashNet](https://github.com/garythung/trashnet) dataset (Gary Thung & Mindy Yang, MIT License), files
    `plastic251`, `plastic267` and `trash71`.

## Note on the numbers

The video is a scripted re-creation of the UI, not a screen capture, but every confidence shown is real: each was
produced by running `public/model/smart_waste_mobilenetv2.onnx` on that exact photo with the app's own resampler
(`lib/preprocess.ts`). The metal result matches `docs/screenshot-classifier.png` digit for digit. They live in
`SAMPLES` in `src/timeline.ts`.

Two caveats:

- The model was trained on TrashNet, so the plastic and trash photos may have been in its training split; the
  four owner-supplied photos are out-of-sample. Treat the video as a demo, not as an accuracy test.
- The TrashNet photos were picked because the model classifies them correctly (and they are clear, recognisable items).
  The owner's overflowing-bins photo was not used because the model calls it Plastic 93.3%.
