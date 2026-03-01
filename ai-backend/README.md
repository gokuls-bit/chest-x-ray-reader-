# Chest X-Ray AI Backend

EfficientNet-B0 binary classifier for chest X-ray diagnosis (Normal vs Pneumonia), served via FastAPI.

## Why EfficientNet-B0?

| Factor | Detail |
|---|---|
| **Efficiency** | Compound scaling balances depth, width, and resolution — 77.1% ImageNet top-1 accuracy with only 5.3M parameters |
| **Transfer learning** | Pre-trained ImageNet features (edges, textures, shapes) transfer remarkably well to medical imaging |
| **Lightweight** | Smallest EfficientNet variant — fast inference, runs on CPU if needed, ideal for a real-time API |
| **Medical imaging track record** | Widely validated on CheXpert, NIH Chest X-ray, and MIMIC-CXR benchmarks |

## Overfitting Prevention

- **Frozen backbone** — only the custom classifier head (~660K params) trains; the 4.6M backbone params stay fixed
- **Dropout (0.3)** — applied between classifier layers
- **Data augmentation** — random horizontal flip, rotation (±15°), color jitter, affine translation
- **Early stopping** — halts training when validation loss stops improving for 5 consecutive epochs
- **Weight decay (1e-4)** — L2 regularization via the Adam optimizer

## Future Performance Improvements

1. **Fine-tune upper backbone layers** — unfreeze the last 2–3 EfficientNet blocks after initial convergence
2. **Upgrade model** — try EfficientNet-B3 or B4 for higher-resolution feature extraction
3. **Learning rate scheduling** — CosineAnnealingLR or ReduceLROnPlateau for smoother convergence
4. **GradCAM visualization** — highlight which lung regions drive the prediction
5. **Model ensembling** — combine 3–5 models for higher accuracy
6. **Larger datasets** — augment with CheXpert (224K images) or MIMIC-CXR (377K images)
7. **Multi-class expansion** — extend to COVID-19, Tuberculosis, Pleural Effusion, Cardiomegaly

---

## Quick Start

### 1. Install dependencies

```bash
cd ai-backend
pip install -r requirements.txt
```

### 2. Prepare data

Organize your chest X-ray images in this structure:

```
ai-backend/data/
├── train/
│   ├── Normal/        ← normal chest X-rays
│   └── Pneumonia/     ← pneumonia chest X-rays
└── val/
    ├── Normal/
    └── Pneumonia/
```

> **Tip:** The [Kaggle Chest X-Ray Pneumonia dataset](https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia) follows this exact structure.

### 3. Train the model

```bash
python train.py
```

This will:
- Train EfficientNet-B0 with transfer learning
- Save the best model to `chest_xray_model.pth`
- Generate `confusion_matrix.png`
- Print a full classification report

### 4. Start the prediction server

```bash
python app.py
# or
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Test the API

```bash
curl -X POST http://localhost:8000/predict \
  -F "file=@test_xray.jpg"
```

Response:
```json
{
  "prediction": "Pneumonia",
  "confidence": 0.94,
  "probabilities": [
    {"label": "Normal", "score": 0.06},
    {"label": "Pneumonia", "score": 0.94}
  ]
}
```

### 6. Connect to Next.js frontend

Set in your `.env.local`:

```env
AI_INFERENCE_URL=http://localhost:8000/predict
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check — returns model load status and device |
| `POST` | `/predict` | Upload X-ray image, receive prediction JSON |

## Project Files

| File | Purpose |
|------|---------|
| `config.py` | Centralized hyperparameters, paths, and constants |
| `model.py` | EfficientNet-B0 architecture with custom classifier head |
| `train.py` | Full training pipeline with early stopping and confusion matrix |
| `app.py` | FastAPI prediction server with CORS |
| `requirements.txt` | Python dependencies |
