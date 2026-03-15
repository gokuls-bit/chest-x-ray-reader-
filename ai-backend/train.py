"""
Chest X-Ray AI — Production Grade Training Pipeline
===================================================
Train DenseNet121 binary classifier (Normal vs Pneumonia)
Optimized for RTX 4060 with Native CUDA AMP
"""

import copy
import time
from pathlib import Path
from datetime import timedelta

import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

from config import (
    BATCH_SIZE,
    CLASS_LABELS,
    CONFUSION_MATRIX_PATH,
    ROC_CURVE_PATH,
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
# 1. Data Transforms
# ════════════════════════════════════════════════════════════

train_transforms = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.ToTensor(),
    transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
])

val_transforms = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
])

# ════════════════════════════════════════════════════════════
# 2. Data Loading
# ════════════════════════════════════════════════════════════

def create_dataloaders() -> tuple[DataLoader, DataLoader, datasets.ImageFolder, datasets.ImageFolder]:
    """Build train and validation DataLoaders optimized for throughput."""
    train_dir = DATA_DIR / "train"
    val_dir = DATA_DIR / "val"
    
    if not train_dir.exists() or not val_dir.exists():
        raise FileNotFoundError(f"Missing data directories: {train_dir} or {val_dir}")
        
    train_dataset = datasets.ImageFolder(root=str(train_dir), transform=train_transforms)
    val_dataset = datasets.ImageFolder(root=str(val_dir), transform=val_transforms)
    
    train_loader = DataLoader(
        train_dataset,
        batch_size=BATCH_SIZE,
        shuffle=True,
        num_workers=NUM_WORKERS,
        pin_memory=True
    )
    val_loader = DataLoader(
        val_dataset,
        batch_size=BATCH_SIZE,
        shuffle=False,
        num_workers=NUM_WORKERS,
        pin_memory=True
    )
    
    print(f"📁 Dataset loaded:")
    print(f"  Train: {len(train_dataset):,} samples")
    print(f"  Val  : {len(val_dataset):,} samples")
    return train_loader, val_loader, train_dataset, val_dataset

# ════════════════════════════════════════════════════════════
# 3. Model Training Logic
# ════════════════════════════════════════════════════════════

def train_one_epoch(model, loader, criterion, optimizer, device, scaler):
    """Run one training epoch with Mixed Precision."""
    model.train()
    running_loss, correct, total = 0.0, 0, 0
    
    for images, labels in loader:
        images = images.to(device, non_blocking=True)
        labels = labels.to(device, non_blocking=True)
        
        optimizer.zero_grad()
        
        with torch.amp.autocast('cuda', enabled=device.type == "cuda"):
            outputs = model(images)
            loss = criterion(outputs, labels)
            
        scaler.scale(loss).backward()
        scaler.step(optimizer)
        scaler.update()
        
        running_loss += loss.item() * images.size(0)
        _, preds = torch.max(outputs, 1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)
        
    return running_loss / total, correct / total

@torch.no_grad()
def validate(model, loader, criterion, device):
    """Run validation phase fetching loss, accuracy, and ROC AUC."""
    model.eval()
    running_loss, correct, total = 0.0, 0, 0
    
    all_labels = []
    all_probs = []
    
    for images, labels in loader:
        images = images.to(device, non_blocking=True)
        labels = labels.to(device, non_blocking=True)
        
        with torch.amp.autocast('cuda', enabled=device.type == "cuda"):
            outputs = model(images)
            loss = criterion(outputs, labels)
            probs = torch.softmax(outputs, dim=1)[:, 1]
            
        running_loss += loss.item() * images.size(0)
        _, preds = torch.max(outputs, 1)
        
        correct += (preds == labels).sum().item()
        total += labels.size(0)
        
        all_labels.extend(labels.cpu().numpy())
        all_probs.extend(probs.cpu().numpy())
        
    avg_loss = running_loss / total
    accuracy = correct / total
    
    # Check if there's only 1 class in the batch (can happen with small mock data)
    try:
        auc = roc_auc_score(all_labels, all_probs)
    except ValueError:
        auc = 0.5  # Fallback for mono_class labels
        
    return avg_loss, accuracy, auc, all_labels, all_probs

# ════════════════════════════════════════════════════════════
# 4. Metrics & Plots
# ════════════════════════════════════════════════════════════

def generate_visualizations(labels, probs, preds, save_paths):
    """Generate both Confusion Matrix & ROC Curve gracefully."""
    # Classification Report
    print("\n" + "=" * 55)
    print("  FINAL CLASSIFICATION REPORT")
    print("=" * 55)
    try:
        print(classification_report(labels, preds, target_names=CLASS_LABELS))
    except Exception:
        print("Report failed (likely not enough mock data classes spread).")
        
    # Plotting CM
    cm = confusion_matrix(labels, preds)
    fig, ax = plt.subplots(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=CLASS_LABELS, yticklabels=CLASS_LABELS)
    ax.set_title("Confusion Matrix", fontweight='bold')
    ax.set_xlabel("Predicted")
    ax.set_ylabel("True")
    fig.tight_layout()
    fig.savefig(str(save_paths['cm']), dpi=150)
    plt.close(fig)
    
    # Plotting ROC
    try:
        fpr, tpr, _ = roc_curve(labels, probs)
        roc_auc = roc_auc_score(labels, probs)
        
        fig, ax = plt.subplots(figsize=(6, 5))
        ax.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (area = {roc_auc:.2f})')
        ax.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
        ax.set_xlim([0.0, 1.0])
        ax.set_ylim([0.0, 1.05])
        ax.set_xlabel('False Positive Rate')
        ax.set_ylabel('True Positive Rate')
        ax.set_title('Receiver Operating Characteristic')
        ax.legend(loc="lower right")
        fig.tight_layout()
        fig.savefig(str(save_paths['roc']), dpi=150)
        plt.close(fig)
    except ValueError:
        pass # mock data single class failures
        
    print(f"✓ Plots saved to {save_paths['cm'].parent}")

# ════════════════════════════════════════════════════════════
# 5. Main Execution
# ════════════════════════════════════════════════════════════

def train():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"🖥️  Engine: {device}")
    if device.type == "cuda":
        print(f"   Name  : {torch.cuda.get_device_name(0)}")
    print()
    
    # Core Infrastructure
    train_loader, val_loader, _, _ = create_dataloaders()
    model = ChestXRayClassifier().to(device)
    
    # Training Primitives
    # Use Label Smoothing to prevent over-confidence
    criterion = nn.CrossEntropyLoss(label_smoothing=0.1)
    
    # Use AdamW with weight decay
    optimizer = optim.AdamW(model.parameters(), lr=LEARNING_RATE, weight_decay=WEIGHT_DECAY)
    
    # Step LR scheduler against the maximizing metric (AUC)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='max', factor=0.5, patience=2)
    scaler = torch.amp.GradScaler('cuda', enabled=device.type == "cuda")
    
    # Tracking
    best_auc = 0.0
    epochs_no_improve = 0
    best_state = {}
    
    print(f"{'Epoch':>5} | {'Train Loss':>10} {'Train Acc':>9} | {'Val Loss':>8} {'Val Acc':>8} {'Val AUC':>7} | {'Status'}")
    print("-" * 85)
    
    start_time = time.time()
    for epoch in range(1, NUM_EPOCHS + 1):
        t_loss, t_acc = train_one_epoch(model, train_loader, criterion, optimizer, device, scaler)
        v_loss, v_acc, v_auc, last_val_labels, last_val_probs = validate(model, val_loader, criterion, device)
        
        scheduler.step(v_auc)
        
        status = ""
        current_lr = optimizer.param_groups[0]['lr']
        
        if v_auc > best_auc:
            best_auc = v_auc
            epochs_no_improve = 0
            best_state = {
                'epoch': epoch,
                'model_state_dict': copy.deepcopy(model.state_dict()),
                'optimizer_state_dict': copy.deepcopy(optimizer.state_dict()),
                'auc': best_auc,
                'model_name': 'EfficientNet-B0'
            }
            torch.save(best_state, str(MODEL_SAVE_PATH))
            status = "⭐ Best AUC!"
        else:
            epochs_no_improve += 1
            status = f"wait ({epochs_no_improve}/{PATIENCE})"
            
        print(f"{epoch:>5} | {t_loss:>10.4f} {t_acc:>8.1%} | {v_loss:>8.4f} {v_acc:>8.1%} {v_auc:>7.3f} | {status} (lr: {current_lr:.1e})")
        
        if epochs_no_improve >= PATIENCE:
            print(f"\n⏹️ Early stopping triggered after {epoch} epochs.")
            break
            
    total_time = timedelta(seconds=int(time.time() - start_time))
    print(f"\n🚀 Training Complete in {total_time}")
    
    if best_state:
        print(f"🏆 Best validation AUC: {best_auc:.4f} (from epoch {best_state['epoch']})")
        model.load_state_dict(best_state['model_state_dict'])
        
        # Final evaluation run for plotting best states
        _, _, _, final_labels, final_probs = validate(model, val_loader, criterion, device)
        final_preds = np.array(final_probs) > 0.5
        
        generate_visualizations(
            np.array(final_labels), 
            np.array(final_probs), 
            final_preds, 
            {'cm': CONFUSION_MATRIX_PATH, 'roc': ROC_CURVE_PATH}
        )

if __name__ == '__main__':
    # Fix for multiprocessing in Windows (required when num_workers > 0)
    import multiprocessing
    multiprocessing.freeze_support()
    train()
