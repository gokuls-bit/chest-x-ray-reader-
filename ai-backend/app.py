"""
Chest X-Ray AI — FastAPI Prediction Server
============================================
Serves the trained EfficientNet-B0 model via a REST API.

Endpoints
---------
    GET  /health   → {"status": "healthy", "model_loaded": true}
    POST /predict  → {"prediction": "Pneumonia", "confidence": 0.94, "probabilities": [...]}

Run
---
    uvicorn app:app --host 0.0.0.0 --port 8000 --reload
"""

from __future__ import annotations

import io
from contextlib import asynccontextmanager

import torch
import torch.nn.functional as F
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from torchvision import transforms

from config import (
    ALLOWED_ORIGINS,
    API_HOST,
    API_PORT,
    CLASS_LABELS,
    IMAGE_SIZE,
    IMAGENET_MEAN,
    IMAGENET_STD,
    MODEL_SAVE_PATH,
)
from model import ChestXRayClassifier


# ════════════════════════════════════════════════════════════
# 1.  Global State
# ════════════════════════════════════════════════════════════

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model: ChestXRayClassifier | None = None       # set in lifespan


# ════════════════════════════════════════════════════════════
# 2.  Image Preprocessing Pipeline
# ════════════════════════════════════════════════════════════

preprocess = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
])


def prepare_image(image_bytes: bytes) -> torch.Tensor:
    """
    Read raw bytes → PIL Image → preprocessed (1, 3, 224, 224) tensor.

    - Converts to RGB to guarantee 3 channels (handles grayscale DICOM exports).
    - Applies resize, tensor conversion, and ImageNet normalization.
    """
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {exc}") from exc

    tensor = preprocess(img)           # (3, 224, 224)
    return tensor.unsqueeze(0)         # (1, 3, 224, 224)


# ════════════════════════════════════════════════════════════
# 3.  Application Lifespan  (model loading)
# ════════════════════════════════════════════════════════════

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load model at startup, release on shutdown."""
    global model

    if not MODEL_SAVE_PATH.exists():
        print(f"⚠  Model file not found at {MODEL_SAVE_PATH}")
        print("   Start the server after training: python train.py")
        model = None
    else:
        model = ChestXRayClassifier()
        state_dict = torch.load(str(MODEL_SAVE_PATH), map_location=device, weights_only=True)
        model.load_state_dict(state_dict)
        model.to(device)
        model.eval()
        print(f"✓ Model loaded from {MODEL_SAVE_PATH}  (device={device})")

    yield  # ← app runs

    model = None
    print("🛑 Model unloaded.")


# ════════════════════════════════════════════════════════════
# 4.  FastAPI App
# ════════════════════════════════════════════════════════════

app = FastAPI(
    title="X-Ray AI Prediction Service",
    description="Chest X-ray binary classification (Normal / Pneumonia)",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ════════════════════════════════════════════════════════════
# 5.  Endpoints
# ════════════════════════════════════════════════════════════

@app.get("/health")
async def health():
    """Health-check endpoint."""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "device": str(device),
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Accept a chest X-ray image and return AI prediction.

    Returns
    -------
    {
        "prediction": "Pneumonia",
        "confidence": 0.94,
        "probabilities": [
            {"label": "Normal",    "score": 0.06},
            {"label": "Pneumonia", "score": 0.94}
        ]
    }
    """
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Train the model first: python train.py",
        )

    # ── Validate content type (accept image/* and octet-stream from proxied requests) ──
    content_type = file.content_type or ""
    allowed_prefixes = ("image/", "application/octet-stream", "application/dicom")
    if not any(content_type.startswith(p) for p in allowed_prefixes):
        raise HTTPException(
            status_code=400,
            detail=f"Expected an image file, got: {content_type}",
        )

    # ── Read & preprocess ──
    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")

    tensor = prepare_image(image_bytes).to(device)   # (1, 3, 224, 224)

    # ── Inference ──
    with torch.no_grad():
        logits = model(tensor)                       # (1, 2)
        probs = F.softmax(logits, dim=1).squeeze()   # (2,)

    # ── Build response ──
    confidence, pred_idx = torch.max(probs, 0)
    prediction = CLASS_LABELS[pred_idx.item()]

    probabilities = [
        {"label": label, "score": round(prob.item(), 4)}
        for label, prob in zip(CLASS_LABELS, probs)
    ]

    return {
        "prediction": prediction,
        "confidence": round(confidence.item(), 4),
        "probabilities": probabilities,
    }


@app.post("/batch-predict")
async def batch_predict(files: list[UploadFile] = File(...)):
    """
    Accept multiple chest X-ray images and return predictions for all.

    Returns
    -------
    {
        "total": 3,
        "processed": 2,
        "failed": 1,
        "results": [...]
    }
    """
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Train the model first: python train.py",
        )

    results = []
    for file in files:
        try:
            image_bytes = await file.read()
            if len(image_bytes) == 0:
                results.append({
                    "filename": file.filename or "unknown",
                    "error": "Empty file",
                })
                continue

            tensor = prepare_image(image_bytes).to(device)

            with torch.no_grad():
                logits = model(tensor)
                probs = F.softmax(logits, dim=1).squeeze()

            confidence, pred_idx = torch.max(probs, 0)
            prediction = CLASS_LABELS[pred_idx.item()]

            probabilities = [
                {"label": label, "score": round(prob.item(), 4)}
                for label, prob in zip(CLASS_LABELS, probs)
            ]

            results.append({
                "filename": file.filename or "unknown",
                "prediction": prediction,
                "confidence": round(confidence.item(), 4),
                "probabilities": probabilities,
            })
        except Exception as exc:
            results.append({
                "filename": file.filename or "unknown",
                "error": str(exc),
            })

    processed = [r for r in results if "error" not in r]
    failed = [r for r in results if "error" in r]

    return {
        "total": len(files),
        "processed": len(processed),
        "failed": len(failed),
        "results": results,
    }


# ════════════════════════════════════════════════════════════
# 6.  Direct run
# ════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host=API_HOST, port=API_PORT, reload=True)

