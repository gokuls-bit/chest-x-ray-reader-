"""
Chest X-Ray AI — Model Architecture
=====================================
EfficientNet-B0 with frozen feature extractor and a custom
2-class classifier head.  Shared between train.py and app.py
so the architecture stays identical for training ↔ inference.
"""

import torch
import torch.nn as nn
from torchvision import models

from config import NUM_CLASSES, DROPOUT_RATE


class ChestXRayClassifier(nn.Module):
    """
    Binary chest X-ray classifier built on EfficientNet-B0.

    Architecture
    ------------
    ┌──────────────────────────────────┐
    │  EfficientNet-B0 (frozen)        │  ← Pre-trained ImageNet features
    │  → 1280-dim feature vector       │
    ├──────────────────────────────────┤
    │  Linear(1280, 512)               │
    │  BatchNorm1d(512)                │
    │  ReLU                            │
    │  Dropout(0.3)                    │
    │  Linear(512, 2)                  │  ← [Normal, Pneumonia]
    └──────────────────────────────────┘
    """

    def __init__(self, num_classes: int = NUM_CLASSES, dropout: float = DROPOUT_RATE):
        super().__init__()

        # ── Load pre-trained EfficientNet-B0 ──
        self.backbone = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)

        # ── Freeze all backbone parameters ──
        for param in self.backbone.parameters():
            param.requires_grad = False

        # ── Replace the classifier head ──
        in_features = self.backbone.classifier[1].in_features  # 1280
        self.backbone.classifier = nn.Sequential(
            nn.Linear(in_features, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(inplace=True),
            nn.Dropout(p=dropout),
            nn.Linear(512, num_classes),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Parameters
        ----------
        x : Tensor of shape (B, 3, 224, 224)

        Returns
        -------
        Tensor of shape (B, num_classes) — raw logits
        """
        return self.backbone(x)


# ─── Quick sanity test ───────────────────────────────────
if __name__ == "__main__":
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = ChestXRayClassifier().to(device)

    dummy = torch.randn(1, 3, 224, 224, device=device)
    logits = model(dummy)
    print(f"Input  shape : {dummy.shape}")
    print(f"Output shape : {logits.shape}")   # torch.Size([1, 2])
    print(f"Trainable params : {sum(p.numel() for p in model.parameters() if p.requires_grad):,}")
    print(f"Total params     : {sum(p.numel() for p in model.parameters()):,}")
