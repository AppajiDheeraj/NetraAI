import os
from pathlib import Path
import torch
import torch.nn as nn
from torchvision import models
import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from starlette.responses import FileResponse
import copy
from typing import List

# --- Configuration ---
NUM_CLASSES = 6  # Must match all clients
MODEL_DIR = Path("./global_model")
GLOBAL_MODEL_PATH = MODEL_DIR / "global_model.pth"
UPLOAD_DIR = Path("./uploads")

# List of clients expected to report in before aggregation
EXPECTED_CLIENTS = ["clinic_1", "clinic_2", "clinic_3"]

# Ensure directories exist
MODEL_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# --- Model Definition (Must be IDENTICAL to client) ---
def get_model(num_classes):
    model = models.resnet18(weights=None)
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    return model

# --- Federated Averaging Logic (from your notebook) ---
def federated_average(weight_files: List[Path]):
    print(f"Starting federated averaging for {len(weight_files)} clients...")
    
    client_state_dicts = [torch.load(f) for f in weight_files]
    num_clients = len(client_state_dicts)
    
    if num_clients == 0:
        print("No client weights found. Aborting aggregation.")
        return None

    # Use the first client's state_dict as a template
    avg_state_dict = copy.deepcopy(client_state_dicts[0])
    
    # Zero out all parameters
    for key in avg_state_dict.keys():
        avg_state_dict[key] = torch.zeros_like(avg_state_dict[key])
        
    # Sum all client weights
    for state_dict in client_state_dicts:
        for key in avg_state_dict.keys():
            avg_state_dict[key] += state_dict[key]
            
    # Average the weights
    for key in avg_state_dict.keys():
        avg_state_dict[key] = avg_state_dict[key] / num_clients
        
    print("Averaging complete.")
    return avg_state_dict

# --- FastAPI Application ---
app = FastAPI()

@app.on_event("startup")
def on_startup():
    """Initializes the global model on first-ever startup."""
    if not GLOBAL_MODEL_PATH.exists():
        print("Initializing new global model with pretrained weights...")
        model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
        model.fc = nn.Linear(model.fc.in_features, NUM_CLASSES)
        torch.save(model.state_dict(), GLOBAL_MODEL_PATH)
        print(f"Saved initial global model to {GLOBAL_MODEL_PATH}")
    else:
        print(f"Found existing global model at {GLOBAL_MODEL_PATH}")

@app.get("/")
def read_root():
    return {"status": "Central server is running"}

@app.get("/download-model")
def download_model():
    """Allows clients to download the current global model."""
    if not GLOBAL_MODEL_PATH.exists():
        raise HTTPException(status_code=404, detail="Global model not found.")
    return FileResponse(GLOBAL_MODEL_PATH, media_type='application/octet-stream', filename=GLOBAL_MODEL_PATH.name)

@app.post("/upload-weights/{clinic_id}")
async def upload_weights(clinic_id: str, file: UploadFile = File(...)):
    """Allows clients to upload their trained model weights."""
    if clinic_id not in EXPECTED_CLIENTS:
        raise HTTPException(status_code=400, detail=f"Invalid clinic_id: {clinic_id}")
    
    save_path = UPLOAD_DIR / f"{clinic_id}_weights.pth"
    try:
        with open(save_path, 'wb') as f:
            content = await file.read()
            f.write(content)
        print(f"Received weights from {clinic_id}, saved to {save_path}")
        return {"status": "Weights uploaded successfully", "clinic_id": clinic_id, "filename": save_path.name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {e}")

@app.post("/aggregate")
def trigger_aggregation():
    """
    (Admin) Triggers the server to average all received weights
    and create a new global_model.pth.
    """
    print("Aggregation triggered by API call...")
    
    # Find all the weight files that have been uploaded
    uploaded_weights = list(UPLOAD_DIR.glob("*_weights.pth"))
    
    # Optional: Check if all expected clients have reported
    # For this demo, we'll just average whatever we have.
    if len(uploaded_weights) == 0:
        raise HTTPException(status_code=400, detail="No client weights available to aggregate.")

    # 1. Aggregate the weights
    new_global_weights = federated_average(uploaded_weights)
    
    if new_global_weights:
        # 2. Load into a model and save as the new global model
        model = get_model(NUM_CLASSES)
        model.load_state_dict(new_global_weights)
        torch.save(model.state_dict(), GLOBAL_MODEL_PATH)
        print(f"Saved new aggregated global model to {GLOBAL_MODEL_PATH}")
        
        # 3. Clean up old client weights
        for f in uploaded_weights:
            os.remove(f)
        print(f"Cleaned up {len(uploaded_weights)} client weight files.")
        
        return {"status": f"Aggregation successful. New global model saved. Averaged {len(uploaded_weights)} clients."}
    else:
        raise HTTPException(status_code=500, detail="Aggregation failed.")

if __name__ == "__main__":
    print("Starting central server on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)