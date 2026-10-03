# SmartWaste

**AI-powered waste classification that runs entirely in your browser.**

SmartWaste identifies the material of a waste item from a photo — **cardboard, glass, metal, paper, plastic or trash** — and gives general guidance on how to dispose of it. The classifier is a MobileNetV2 network trained with transfer learning and served with ONNX Runtime Web, so images never leave the user's device.

[![Live demo](https://img.shields.io/badge/demo-smartwaste--cv.vercel.app-1f7f40)](https://smartwaste-cv.vercel.app)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-Keras-ff6f00?logo=tensorflow&logoColor=white)
![ONNX Runtime](https://img.shields.io/badge/ONNX_Runtime-Web-005ced?logo=onnx&logoColor=white)

![SmartWaste home page](docs/screenshot-home.png)

## Features

- **Private by design.** Inference runs client-side in WebAssembly. Images are never uploaded or stored.
- **Simple upload flow.** Drag and drop or browse for a JPG, PNG or WEBP image (up to 20 MB), review it, then analyze.
- **Transparent results.** The predicted category, the confidence for all six classes, and a clear warning when confidence is below 60%.
- **Disposal guidance.** Recyclability and practical handling tips for each category.
- **Responsive and accessible.** Works from small phones to wide desktop screens, with keyboard navigation, visible focus states and reduced-motion support.

![Classification result](docs/screenshot-classifier.png)

## How it works

```text
Image upload → decode & resize to 224×224 RGB → MobileNetV2 (ONNX, in the browser) → softmax over 6 classes → result + guidance
```

The browser reproduces the training pipeline's preprocessing exactly: EXIF-aware decoding and an antialiased bilinear resize with the same sampling as TensorFlow's `tf.image.resize`. MobileNetV2's input scaling (`x / 127.5 − 1`) is built into the exported model, so the web app sends raw 0–255 RGB values. Class order, input shape and evaluation metrics are read from `public/model/metadata.json`, which keeps the app and the model in sync.

## Dataset

The model is trained on two public datasets, mapped to six shared classes:

| Class | [TrashNet](https://github.com/garythung/trashnet) | [RealWaste](https://archive.ics.uci.edu/dataset/908/realwaste) | Total |
|---|---:|---:|---:|
| Cardboard | 403 | 461 | 864 |
| Glass | 501 | 420 | 921 |
| Metal | 409 | 790 | 1,199 |
| Paper | 594 | 500 | 1,094 |
| Plastic | 480 | 921 | 1,401 |
| Trash | 137 | 495 | 632 |
| **Total** | **2,524** | **3,587** | **6,111** |

- **TrashNet** contains single objects on a plain white background. Three byte-identical duplicates are removed.
- **RealWaste** contains items photographed at a landfill, adding cluttered, real-world conditions. Its *Miscellaneous Trash* class maps to *trash*. *Food Organics*, *Vegetation* and *Textile Trash* have no matching class and are excluded.
- The images are split **70 / 15 / 15** into train (4,277), validation (917) and test (917). The split is stratified by class and source, uses a fixed seed (`42`), and is checked for overlap by both file name and image content.

## Model

| | |
|---|---|
| Base network | MobileNetV2, ImageNet weights |
| Classification head | Global average pooling → Dropout (0.2) → Dense (256, ReLU, L2 1e-4) → Dropout (0.4) → Dense (6, softmax) |
| Stage 1 | Frozen base, head trained with Adam (1e-3) |
| Stage 2 | Fine-tuning from `block_13_expand` with Adam (1e-5) |
| Regularisation | Data augmentation (flip, rotation, zoom, translation, contrast, brightness), dropout, L2, class weights, early stopping |
| Export | ONNX (opset 17), verified against Keras on all 917 test images (max difference < 1e-5, 100% top-1 agreement) |

## Results

Evaluated once on the held-out test set (917 images):

| Accuracy | Macro precision | Macro recall | Macro F1 |
|---:|---:|---:|---:|
| **84.4%** | 84.7% | 83.8% | 84.0% |

| Class | Precision | Recall | F1 | Test images |
|---|---:|---:|---:|---:|
| Cardboard | 0.855 | 0.815 | 0.835 | 130 |
| Glass | 0.767 | 0.884 | 0.822 | 138 |
| Metal | 0.877 | 0.872 | 0.875 | 180 |
| Paper | 0.841 | 0.902 | 0.871 | 164 |
| Plastic | 0.855 | 0.814 | 0.834 | 210 |
| Trash | 0.886 | 0.737 | 0.805 | 95 |

Accuracy is similar on both sources: **83.9%** on the TrashNet test images and **84.8%** on the RealWaste test images. A model trained on TrashNet alone reached only 47.0% on the same RealWaste images. Adding RealWaste was what made the model work on everyday photos.

<p align="center">
  <img src="docs/confusion_matrix.png" alt="Confusion matrix" width="100%">
</p>

Training curves are available in [`docs/training_curves.png`](docs/training_curves.png).

### Limitations

- The model only knows six categories. Every image is assigned to one of them, even if it shows something else.
- The most common errors are plastic predicted as glass, metal as glass, and cardboard as paper.
- Photos with several items, heavy clutter or poor lighting can be misclassified, sometimes with high confidence.
- Disposal guidance is general. Recycling rules vary by location.

## Getting started

**Prerequisites:** Node.js 20.9 or newer.

```bash
git clone https://github.com/anniesrdnl/smart-waste.git
cd smart-waste
npm install
npm run dev
```

Open <http://localhost:3000>. The `predev` and `prebuild` scripts copy the ONNX Runtime Web assets from `node_modules` into `public/ort/`.

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |

## Training

The full pipeline is in [`training/smart_waste_training.ipynb`](training/smart_waste_training.ipynb). It covers:

1. Downloading the datasets.
2. Cleaning, deduplicating and splitting the data.
3. Training and fine-tuning.
4. Evaluation, including per-source metrics.
5. ONNX export and parity checks.

To retrain:

1. Open the notebook in Google Colab with a GPU runtime, or locally with the packages in [`training/requirements.txt`](training/requirements.txt).
2. Run all cells. The notebook writes `smart_waste_mobilenetv2.onnx` and `metadata.json` to `artifacts/web_model/`.
3. Copy both files into `public/model/`. The web app picks up the new classes, input format and metrics automatically.

## Deployment

The app is a static Next.js site and needs no server or environment variables. It is deployed on [Vercel](https://vercel.com): import the repository and keep the default Next.js settings. Every push to `main` triggers a new deployment.

## Project structure

```text
app/              Root layout, page and global styles
components/       UI components (header, classifier workspace, content sections)
lib/              Preprocessing, model loading, error handling, class data
types/            Shared TypeScript types
public/model/     Trained ONNX model and metadata
scripts/          Build helper that copies ONNX Runtime Web assets
training/         Training notebook and Python requirements
docs/             Screenshots and evaluation figures
```

## Tech stack

Next.js · React · TypeScript · Tailwind CSS · TensorFlow / Keras · ONNX · ONNX Runtime Web · Vercel

## Acknowledgements

- **TrashNet** — G. Thung and M. Yang, *Classification of Trash for Recyclability Status*, Stanford CS229, 2016.
- **RealWaste** — S. Single, S. Iranmanesh and R. Raad, *RealWaste: A Novel Real-Life Data Set for Landfill Waste Classification Using Deep Learning*, Information 14(12), 2023. Licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- **MobileNetV2** — M. Sandler et al., *MobileNetV2: Inverted Residuals and Linear Bottlenecks*, CVPR 2018.
