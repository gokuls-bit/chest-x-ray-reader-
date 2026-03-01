"""
Chest X-Ray AI — Centralized Configuration
============================================
All hyperparameters, paths, and constants live here so both
train.py and app.py share a single source of truth.
"""

import os
from pathlib import Path

# ──────────────────────────────────────────────
# Paths
# ──────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"                     # data/train/  data/val/
MODEL_SAVE_PATH = BASE_DIR / "chest_xray_model.pth"
CONFUSION_MATRIX_PATH = BASE_DIR / "confusion_matrix.png"

# ──────────────────────────────────────────────
# Image preprocessing
# ──────────────────────────────────────────────
IMAGE_SIZE = 224                                  # EfficientNet-B0 native resolution
IMAGENET_MEAN = [0.485, 0.456, 0.406]            # ImageNet channel means
IMAGENET_STD = [0.229, 0.224, 0.225]             # ImageNet channel stds

# ──────────────────────────────────────────────
# Training hyperparameters
# ──────────────────────────────────────────────
BATCH_SIZE = 32
NUM_WORKERS = os.cpu_count() or 4                # DataLoader workers
LEARNING_RATE = 1e-3
WEIGHT_DECAY = 1e-4                              # L2 regularization
NUM_EPOCHS = 25
PATIENCE = 5                                     # Early-stopping patience (epochs)
DROPOUT_RATE = 0.3

# ──────────────────────────────────────────────
# Model architecture
# ──────────────────────────────────────────────
NUM_CLASSES = 2
CLASS_LABELS = ["Normal", "Pneumonia"]

# ──────────────────────────────────────────────
# FastAPI / CORS
# ──────────────────────────────────────────────
ALLOWED_ORIGINS = [
    "http://localhost:3000",                      # Next.js dev server
    "http://127.0.0.1:3000",
]
API_HOST = "0.0.0.0"
API_PORT = 8000
