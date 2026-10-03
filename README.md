# Smart Waste Classification System

Upload a photo of a waste item and Smart Waste classifies it as **cardboard, glass, metal, paper, plastic or trash**, then gives general disposal guidance. It uses **MobileNetV2 with transfer learning**, and the model runs **entirely in the browser**.

**Live demo:** <https://smartwaste-cv.vercel.app>

## How it works

```text
Upload image → resize to 224 × 224 RGB → MobileNetV2 (in the browser) → probabilities for 6 classes → result + disposal guidance
```

- Upload only: drag and drop or browse. There is no camera access.
- The image is processed on your device. It is never uploaded or stored.
- Every confidence score comes from the real model. Nothing is hardcoded.

## Dataset

[TrashNet](https://github.com/garythung/trashnet) by Gary Thung and Mindy Yang (Stanford CS229, 2016): 2,527 photos across the six classes, each showing a single object on a white background.

The notebook removes 3 exact duplicates and splits the remaining **2,524** images into 70% train (1,766), 15% validation (379) and 15% test (379). The split is stratified, uses `SEED = 42`, and checks that no image appears in two splits.

## Model

| | |
|---|---|
| Base model | MobileNetV2, ImageNet weights |
| Head | Global average pooling → Dropout → Dense(256) → Dropout → Dense(6, softmax) |
| Training | 1. Frozen base, train the head (Adam 1e-3). 2. Fine-tune from `block_13_expand` (Adam 1e-5) |
| Regularisation | Light augmentation, dropout, L2, class weights, early stopping |
| Preprocessing | `x / 127.5 − 1`, built into the model, so the browser sends plain 0–255 RGB |
| Web format | ONNX, run with ONNX Runtime Web |

## Results

Measured once on the 379 held-out test images:

| Accuracy | Precision (macro) | Recall (macro) | F1 (macro) |
|---|---|---|---|
| **86.02%** | 83.91% | 82.55% | 83.08% |

| Class | Precision | Recall | F1 |
|---|---|---|---|
| Cardboard | 0.917 | 0.902 | 0.909 |
| Glass | 0.861 | 0.907 | 0.883 |
| Metal | 0.831 | 0.885 | 0.857 |
| Paper | 0.921 | 0.910 | 0.915 |
| Plastic | 0.800 | 0.778 | 0.789 |
| Trash | 0.706 | 0.571 | 0.632 |

![Confusion matrix](docs/confusion_matrix.png)

**Limitations:** *trash* (only 21 test images) and *plastic* are the weakest classes. Plastic is most often confused with glass and metal. TrashNet photos all have plain backgrounds, so cluttered real-world photos can be misclassified, sometimes with high confidence.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Retrain the model

1. Open [`training/smart_waste_training.ipynb`](training/smart_waste_training.ipynb) in Google Colab and choose a **T4 GPU** runtime.
2. **Run all.** The notebook downloads the dataset, trains, evaluates, converts the model to ONNX and checks the result against Keras.
3. Copy the downloaded `smart_waste_mobilenetv2.onnx` and `metadata.json` into `public/model/`.

The website reads the class order, input format and test metrics from `metadata.json`.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Import it at <https://vercel.com/new>. Vercel detects Next.js, so keep the default settings.
3. Click **Deploy**. Each later push to `main` redeploys automatically.

No server or environment variables are needed.

## Project structure

```text
app/            Page, layout, global styles
components/     UI components (uploader, results, sections)
lib/            Preprocessing, model loading, class list, disposal guidance
public/model/   Trained ONNX model + metadata.json
training/       Training notebook
docs/           Result figures
```

## Troubleshooting

| Problem | Fix |
|---|---|
| "Trained model not added yet" | Copy both model files into `public/model/` and redeploy. |
| HEIC photo is rejected | Save the photo as JPG or PNG. Most browsers can't read HEIC. |
| Wrong prediction on a busy photo | Use one item on a plain background (see Limitations). |

**Tech stack:** Next.js · React · TypeScript · Tailwind CSS · TensorFlow/Keras · ONNX Runtime Web · Vercel
