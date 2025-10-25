import os
from pathlib import Path
import time
import copy
import random
import requests  # Use requests to communicate with the central server
import uvicorn
from fastapi import FastAPI, BackgroundTasks, HTTPException

import numpy as np
from PIL import Image
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import transforms, models, datasets
from tqdm import tqdm

# --- Configuration ---
CLINIC_ID = "clinic_2"  # IMPORTANT: Each clinic MUST change this
DATA_DIR = Path("./clinic_2_data")  # Path to this clinic's local data
CENTRAL_SERVER_URL = "http://127.0.0.1:8000"  # URL of the central server

# Local paths
MODEL_DIR = Path("./models")
GLOBAL_MODEL_PATH = MODEL_DIR / "global_model.pth"
OUTPUT_WEIGHTS_PATH = MODEL_DIR / f"{CLINIC_ID}_weights.pth"

# Training parameters
BATCH_SIZE = 32
EPOCHS = 15  # Train for 1-5 epochs per round in FL
LR = 1e-4
NUM_WORKERS = 16
INPUT_SIZE = 224
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Ensure model directory exists
MODEL_DIR.mkdir(parents=True, exist_ok=True)

# --- Model & Transforms (Must be IDENTICAL across all clients) ---
NUM_CLASSES = 6  # This should be a fixed, shared config

def get_model(num_classes):
    model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    return model

train_transform = transforms.Compose([
    transforms.RandomResizedCrop(INPUT_SIZE),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(8),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# --- Helper Functions for Server Communication ---

def download_global_model():
    """Downloads the latest global model from the central server."""
    try:
        url = f"{CENTRAL_SERVER_URL}/download-model"
        r = requests.get(url)
        r.raise_for_status()  # Raise an exception for bad status codes
        with open(GLOBAL_MODEL_PATH, 'wb') as f:
            f.write(r.content)
        print(f"Successfully downloaded global model to {GLOBAL_MODEL_PATH}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error downloading global model: {e}")
        return False

def upload_local_weights():
    """Uploads the locally trained weights to the central server."""
    try:
        url = f"{CENTRAL_SERVER_URL}/upload-weights/{CLINIC_ID}"
        with open(OUTPUT_WEIGHTS_PATH, 'rb') as f:
            files = {'file': (OUTPUT_WEIGHTS_PATH.name, f, 'application/octet-stream')}
            r = requests.post(url, files=files)
            r.raise_for_status()
        print(f"Successfully uploaded local weights: {OUTPUT_WEIGHTS_PATH}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error uploading weights: {e}")
        return False

# --- Training Logic (from your notebook) ---

def train_one_epoch(model, loader, criterion, optimizer, device):
    model.train()
    total_loss = 0.0
    total_correct = 0
    total = 0
    # Wrap loader in tqdm for progress bar in console
    loop = tqdm(loader, desc=f"Clinic {CLINIC_ID} Training", leave=True)
    
    for imgs, labels in loop:
        imgs, labels = imgs.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(imgs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        preds = outputs.argmax(dim=1)
        total += imgs.size(0)
        total_loss += loss.item() * imgs.size(0)
        total_correct += (preds == labels).sum().item()
        loop.set_postfix(loss=total_loss/total, acc=total_correct/total)
    
    avg_loss = total_loss / total
    avg_acc = total_correct / total
    print(f"Training complete. Loss: {avg_loss:.4f}, Acc: {avg_acc:.4f}")
    return avg_loss, avg_acc

def run_client_training():
    """The main federated learning task to be run in the background."""
    print(f"--- Starting background training task for {CLINIC_ID} ---")
    
    # 1. Download latest global model
    if not download_global_model():
        print("Failed to download model. Aborting training task.")
        return

    # 2. Load data
    train_dataset = datasets.ImageFolder(str(DATA_DIR), transform=train_transform)
    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=NUM_WORKERS)
    print(f"Data loaded: {len(train_dataset)} images.")
    
    # 3. Initialize model and load global weights
    model = get_model(NUM_CLASSES)
    model.load_state_dict(torch.load(GLOBAL_MODEL_PATH, map_location=DEVICE))
    model = model.to(DEVICE)
    
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=LR)

    # 4. Run training
    for epoch in range(EPOCHS):
        print(f"Starting Epoch {epoch+1}/{EPOCHS}")
        train_loss, train_acc = train_one_epoch(model, train_loader, criterion, optimizer, DEVICE)

    # 5. Save the updated local weights
    print(f"Saving updated weights to {OUTPUT_WEIGHTS_PATH}")
    torch.save(model.state_dict(), OUTPUT_WEIGHTS_PATH)
    
    # 6. Upload local weights to server
    upload_local_weights()
    
    print(f"--- Background training task for {CLINIC_ID} complete ---")

# --- FastAPI Application ---
app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "Clinic server is running", "clinic_id": CLINIC_ID}

@app.post("/start-training")
def start_training(background_tasks: BackgroundTasks):
    """
    Triggers the client to download the global model, train on it,
    and upload its new weights. Runs in the background.
    """
    print("Received /start-training request. Adding to background tasks.")
    background_tasks.add_task(run_client_training)
    return {"status": "Training initiated in background"}

if __name__ == "__main__":
    print(f"Starting clinic server for {CLINIC_ID} on port 8001...")
    # Make sure each clinic server runs on a different port if on the same machine
    # e.g., clinic_1 on 8001, clinic_2 on 8002, etc.
    uvicorn.run(app, host="0.0.0.0", port=8002)