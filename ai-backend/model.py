import torch
import torch.nn as nn
from torchvision import models
from config import NUM_CLASSES

class ChestXRayClassifier(nn.Module):
    """
    Binary chest X-ray classifier built on DenseNet121.
    Recommended architecture for medical imaging.
    """
    def __init__(self, num_classes: int = NUM_CLASSES):
        super().__init__()
        
        # Load pre-trained DenseNet121
        self.backbone = models.densenet121(weights="IMAGENET1K_V1")
        
        # Replace the classifier head for binary classification
        in_features = self.backbone.classifier.in_features
        self.backbone.classifier = nn.Linear(in_features, num_classes)
        
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

if __name__ == "__main__":
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = ChestXRayClassifier().to(device)
    
    dummy = torch.randn(1, 3, 224, 224, device=device)
    logits = model(dummy)
    
    total_params = sum(p.numel() for p in model.parameters())
    trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
    
    print(f"Input  shape : {dummy.shape}")
    print(f"Output shape : {logits.shape}")
    print(f"Trainable params : {trainable_params:,}")
    print(f"Total params     : {total_params:,}")
