import os
from PIL import Image, ImageDraw
import random

def create_mock_image(path, label="Normal"):
    img = Image.new('RGB', (224, 224), color=(0, 0, 0))
    d = ImageDraw.Draw(img)
    # Just draw some random lines to make it non-blank
    for _ in range(20):
        x1, y1 = random.randint(0, 224), random.randint(0, 224)
        x2, y2 = random.randint(0, 224), random.randint(0, 224)
        color = (random.randint(50, 255), random.randint(50, 255), random.randint(50, 255))
        d.line([(x1, y1), (x2, y2)], fill=color, width=3)
    
    img.save(path)

base_dir = "data"
splits = ["train", "val"]
classes = ["Normal", "Pneumonia"]

# Create 20 train, 10 val images per class
counts = {"train": 20, "val": 10}

for split in splits:
    for cls in classes:
        dir_path = os.path.join(base_dir, split, cls)
        os.makedirs(dir_path, exist_ok=True)
        for i in range(counts[split]):
            create_mock_image(os.path.join(dir_path, f"mock_{i}.jpg"), cls)

print("Mock data created!")
