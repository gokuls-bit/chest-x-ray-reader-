import io
import time
from contextlib import asynccontextmanager
from typing import List, Optional

import torch
import torch.nn.functional as F
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
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
# 1.  Schemas
# ════════════════════════════════════════════════════════════

class ProbScore(BaseModel):
    label: str
    score: float

class PredictionResponse(BaseModel):
    filename: str
    prediction: str
    confidence: float
    severity: str
    findings: List[str]
    probabilities: List[ProbScore]
    processing_time: float

class BatchPredictionResponse(BaseModel):
    total: int
    processed: int
    failed: int
    results: List[dict]


# ════════════════════════════════════════════════════════════
# 2.  Global State & Helpers
# ════════════════════════════════════════════════════════════

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model: Optional[ChestXRayClassifier] = None

preprocess = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
])

def get_severity_and_findings(prediction: str, confidence: float) -> tuple[str, List[str]]:
    """Generate clinical severity and pseudo-findings based on AI results."""
    if prediction == "Normal":
        if confidence > 0.9:
            return "Normal", ["Clear lung fields", "No pleural effusions", "Normal cardiothoracic ratio"]
        else:
            return "Review", ["Lungs appear clear", "Slight opacity mentioned for review", "Normal heart size"]
    else:
        # Pneumonia detected
        if confidence > 0.85:
            return "Critical", ["Consolidation in lung lobes", "Increased opacity", "Possible pleural effusion", "Immediate clinical correlation required"]
        else:
            return "Review", ["Patchy infiltrates detected", "Increased bronchovascular markings", "Follow-up imaging recommended"]

def prepare_image(image_bytes: bytes) -> torch.Tensor:
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {exc}") from exc

    tensor = preprocess(img)
    return tensor.unsqueeze(0)


# ════════════════════════════════════════════════════════════
# 3.  Application Lifespan
# ════════════════════════════════════════════════════════════

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model

    if not MODEL_SAVE_PATH.exists():
        print(f"⚠  Model file not found at {MODEL_SAVE_PATH}")
        model = None
    else:
        try:
            model = ChestXRayClassifier()
            # FIX: Handle the full checkpoint dictionary saved by train.py
            checkpoint = torch.load(str(MODEL_SAVE_PATH), map_location=device, weights_only=True)
            
            if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
                state_dict = checkpoint["model_state_dict"]
                print(f"✓ Loaded checkpoint from epoch {checkpoint.get('epoch', 'unknown')}")
            else:
                state_dict = checkpoint
                
            model.load_state_dict(state_dict)
            model.to(device)
            model.eval()
            print(f"✓ Model loaded successfully (device={device})")
        except Exception as e:
            print(f"❌ Failed to load model: {e}")
            model = None

    yield
    model = None


# ════════════════════════════════════════════════════════════
# 4.  FastAPI App
# ════════════════════════════════════════════════════════════

app = FastAPI(
    title="X-Ray AI Prediction Service",
    description="Chest X-ray binary classification (Normal / Pneumonia)",
    version="1.1.0",
    lifespan=lifespan,
)

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
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "device": str(device),
        "version": "1.1.0"
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    start_time = time.time()
    
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded.")

    # Validation
    content_type = file.content_type or ""
    allowed_prefixes = ("image/", "application/octet-stream", "application/dicom")
    if not any(content_type.startswith(p) for p in allowed_prefixes):
        raise HTTPException(status_code=400, detail=f"Invalid file type: {content_type}")

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty file.")

    # Inference
    tensor = prepare_image(image_bytes).to(device)
    with torch.no_grad():
        logits = model(tensor)
        probs = F.softmax(logits, dim=1).squeeze()

    confidence, pred_idx = torch.max(probs, 0)
    prediction = CLASS_LABELS[pred_idx.item()]
    conf_val = float(confidence.item())

    # Severity & Findings
    severity, findings = get_severity_and_findings(prediction, conf_val)

    probabilities = [
        ProbScore(label=label, score=round(float(prob.item()), 4))
        for label, prob in zip(CLASS_LABELS, probs)
    ]

    return PredictionResponse(
        filename=file.filename or "unknown",
        prediction=prediction,
        confidence=round(conf_val, 4),
        severity=severity,
        findings=findings,
        probabilities=probabilities,
        processing_time=round(time.time() - start_time, 4)
    )


@app.post("/batch-predict", response_model=BatchPredictionResponse)
async def batch_predict(files: List[UploadFile] = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded.")

    results = []
    for file in files:
        try:
            image_bytes = await file.read()
            tensor = prepare_image(image_bytes).to(device)

            with torch.no_grad():
                logits = model(tensor)
                probs = F.softmax(logits, dim=1).squeeze()

            confidence, pred_idx = torch.max(probs, 0)
            prediction = CLASS_LABELS[pred_idx.item()]
            conf_val = float(confidence.item())
            
            severity, findings = get_severity_and_findings(prediction, conf_val)

            results.append({
                "filename": file.filename or "unknown",
                "prediction": prediction,
                "confidence": round(conf_val, 4),
                "severity": severity,
                "findings": findings,
                "probabilities": [
                    {"label": l, "score": round(float(p.item()), 4)}
                    for l, p in zip(CLASS_LABELS, probs)
                ]
            })
        except Exception as exc:
            results.append({
                "filename": file.filename or "unknown",
                "error": str(exc),
            })

    processed = [r for r in results if "error" not in r]
    failed = [r for r in results if "error" in r]

    return BatchPredictionResponse(
        total=len(files),
        processed=len(processed),
        failed=len(failed),
        results=results,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host=API_HOST, port=API_PORT, reload=True)

