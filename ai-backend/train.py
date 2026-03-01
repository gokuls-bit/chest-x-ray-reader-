"""
Chest X-Ray AI — Full Training Pipeline
=========================================
Train an EfficientNet-B0 binary classifier (Normal vs Pneumonia)
with transfer learning, data augmentation, early stopping, and
confusion matrix visualization.

Usage
-----
    python train.py

Expected data layout
--------------------
    data/
    ├── train/
    │   ├── Normal/      ← Normal chest X-ray images
    │   └── Pneumonia/   ← Pneumonia chest X-ray images
    └── val/
        ├── Normal/
        └── Pneumonia/
"""

from __future__ import annotations

import copy
import time
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.metrics import confusion_matrix, classification_report
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

from config import (
    BATCH_SIZE,
    CLASS_LABELS,
    CONFUSION_MATRIX_PATH,
    DATA_DIR,
    IMAGE_SIZE,
    IMAGENET_MEAN,
    IMAGENET_STD,
    LEARNING_RATE,
    MODEL_SAVE_PATH,
    NUM_EPOCHS,
    NUM_WORKERS,
    PATIENCE,
    WEIGHT_DECAY,
)
from model import ChestXRayClassifier


# ════════════════════════════════════════════════════════════
# 1.  Data Transforms
# ════════════════════════════════════════════════════════════

train_transforms = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(degrees=15),
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.RandomAffine(degrees=0, translate=(0.05, 0.05)),
    transforms.ToTensor(),
    transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
])

val_transforms = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
])


# ════════════════════════════════════════════════════════════
# 2.  Data Loading
# ════════════════════════════════════════════════════════════

def create_dataloaders(
    data_dir: Path = DATA_DIR,
    batch_size: int = BATCH_SIZE,
) -> tuple[DataLoader, DataLoader, datasets.ImageFolder, datasets.ImageFolder]:
    """Build train and validation DataLoaders from an ImageFolder layout."""

    train_dir = data_dir / "train"
    val_dir = data_dir / "val"

    if not train_dir.exists():
        raise FileNotFoundError(
            f"Training directory not found: {train_dir}\n"
            f"Expected structure:\n"
            f"  {data_dir}/train/Normal/\n"
            f"  {data_dir}/train/Pneumonia/"
        )
    if not val_dir.exists():
        raise FileNotFoundError(
            f"Validation directory not found: {val_dir}\n"
            f"Expected structure:\n"
            f"  {data_dir}/val/Normal/\n"
            f"  {data_dir}/val/Pneumonia/"
        )

    train_dataset = datasets.ImageFolder(root=str(train_dir), transform=train_transforms)
    val_dataset = datasets.ImageFolder(root=str(val_dir), transform=val_transforms)

    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=NUM_WORKERS,
        pin_memory=True,
    )
    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=NUM_WORKERS,
        pin_memory=True,
    )

    print(f"✓ Training samples   : {len(train_dataset):,}")
    print(f"✓ Validation samples : {len(val_dataset):,}")
    print(f"✓ Classes            : {train_dataset.classes}")
    print(f"✓ Batch size         : {batch_size}")
    print()

    return train_loader, val_loader, train_dataset, val_dataset


# ════════════════════════════════════════════════════════════
# 3.  Training & Validation Loops
# ════════════════════════════════════════════════════════════

def train_one_epoch(
    model: nn.Module,
    loader: DataLoader,
    criterion: nn.Module,
    optimizer: optim.Optimizer,
    device: torch.device,
) -> tuple[float, float]:
    """Run one training epoch, return (avg_loss, accuracy)."""
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0

    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * images.size(0)
        _, preds = torch.max(outputs, 1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)

    avg_loss = running_loss / total
    accuracy = correct / total
    return avg_loss, accuracy


@torch.no_grad()
def validate(
    model: nn.Module,
    loader: DataLoader,
    criterion: nn.Module,
    device: torch.device,
) -> tuple[float, float]:
    """Run validation, return (avg_loss, accuracy)."""
    model.eval()
    running_loss = 0.0
    correct = 0
    total = 0

    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)

        outputs = model(images)
        loss = criterion(outputs, labels)

        running_loss += loss.item() * images.size(0)
        _, preds = torch.max(outputs, 1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)

    avg_loss = running_loss / total
    accuracy = correct / total
    return avg_loss, accuracy


# ════════════════════════════════════════════════════════════
# 4.  Confusion Matrix
# ════════════════════════════════════════════════════════════

@torch.no_grad()
def generate_confusion_matrix(
    model: nn.Module,
    loader: DataLoader,
    device: torch.device,
    save_path: Path = CONFUSION_MATRIX_PATH,
) -> None:
    """Generate, print, and save confusion matrix + classification report."""
    model.eval()
    all_preds: list[int] = []
    all_labels: list[int] = []

    for images, labels in loader:
        images = images.to(device)
        outputs = model(images)
        _, preds = torch.max(outputs, 1)
        all_preds.extend(preds.cpu().numpy())
        all_labels.extend(labels.numpy())

    # ── Classification report ──
    print("\n" + "=" * 55)
    print("  CLASSIFICATION REPORT")
    print("=" * 55)
    print(classification_report(all_labels, all_preds, target_names=CLASS_LABELS))

    # ── Confusion matrix plot ──
    cm = confusion_matrix(all_labels, all_preds)
    fig, ax = plt.subplots(figsize=(8, 6))
    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=CLASS_LABELS,
        yticklabels=CLASS_LABELS,
        ax=ax,
        linewidths=0.5,
        linecolor="gray",
    )
    ax.set_xlabel("Predicted Label", fontsize=13)
    ax.set_ylabel("True Label", fontsize=13)
    ax.set_title("Chest X-Ray Classification — Confusion Matrix", fontsize=14, fontweight="bold")
    fig.tight_layout()
    fig.savefig(str(save_path), dpi=150)
    plt.close(fig)
    print(f"✓ Confusion matrix saved → {save_path}")


# ════════════════════════════════════════════════════════════
# 5.  Main Training Orchestrator
# ════════════════════════════════════════════════════════════

def train(
    num_epochs: int = NUM_EPOCHS,
    patience: int = PATIENCE,
) -> None:
    """Full training run with early stopping."""

    # ── Device ──
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"🖥  Device : {device}")
    if device.type == "cuda":
        print(f"   GPU    : {torch.cuda.get_device_name(0)}")
    print()

    # ── Data ──
    train_loader, val_loader, train_ds, val_ds = create_dataloaders()

    # ── Model ──
    model = ChestXRayClassifier().to(device)
    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    total = sum(p.numel() for p in model.parameters())
    print(f"📐 Trainable params : {trainable:>10,}  /  {total:,} total")
    print()

    # ── Loss / Optimizer ──
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(
        filter(lambda p: p.requires_grad, model.parameters()),
        lr=LEARNING_RATE,
        weight_decay=WEIGHT_DECAY,
    )

    # ── Training state ──
    best_val_loss = float("inf")
    best_val_acc = 0.0
    best_epoch = 0
    best_weights = copy.deepcopy(model.state_dict())
    epochs_no_improve = 0

    history = {
        "train_loss": [], "train_acc": [],
        "val_loss": [], "val_acc": [],
    }

    # ── Header ──
    header = f"{'Epoch':>6} │ {'Train Loss':>10} {'Train Acc':>10} │ {'Val Loss':>10} {'Val Acc':>10} │ {'Status'}"
    print("─" * len(header))
    print(header)
    print("─" * len(header))

    start_time = time.time()

    for epoch in range(1, num_epochs + 1):
        epoch_start = time.time()

        # ── Train ──
        train_loss, train_acc = train_one_epoch(model, train_loader, criterion, optimizer, device)

        # ── Validate ──
        val_loss, val_acc = validate(model, val_loader, criterion, device)

        # ── Record history ──
        history["train_loss"].append(train_loss)
        history["train_acc"].append(train_acc)
        history["val_loss"].append(val_loss)
        history["val_acc"].append(val_acc)

        # ── Check improvement ──
        status = ""
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            best_val_acc = val_acc
            best_epoch = epoch
            best_weights = copy.deepcopy(model.state_dict())
            epochs_no_improve = 0
            torch.save(best_weights, str(MODEL_SAVE_PATH))
            status = f"✓ saved (↓ loss)"
        else:
            epochs_no_improve += 1
            status = f"  no improve ({epochs_no_improve}/{patience})"

        elapsed = time.time() - epoch_start
        print(
            f"{epoch:>6} │ {train_loss:>10.4f} {train_acc:>9.1%} │ "
            f"{val_loss:>10.4f} {val_acc:>9.1%} │ {status}  ({elapsed:.1f}s)"
        )

        # ── Early stopping ──
        if epochs_no_improve >= patience:
            print(f"\n⏹  Early stopping at epoch {epoch} — no improvement for {patience} epochs.")
            break

    total_time = time.time() - start_time
    print("─" * len(header))

    # ── Restore best weights ──
    model.load_state_dict(best_weights)
    print(f"\n🏆 Best model from epoch {best_epoch}:")
    print(f"   Val Loss     : {best_val_loss:.4f}")
    print(f"   Val Accuracy : {best_val_acc:.1%}")
    print(f"   Saved to     : {MODEL_SAVE_PATH}")
    print(f"   Total time   : {total_time:.1f}s")

    # ── Confusion matrix on validation set ──
    generate_confusion_matrix(model, val_loader, device)

    print("\n✅ Training complete!")


# ════════════════════════════════════════════════════════════
# 6.  Entry Point
# ════════════════════════════════════════════════════════════

if __name__ == "__main__":
    train()
