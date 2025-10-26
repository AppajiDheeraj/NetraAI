import os
import io
import base64
import json
from pathlib import Path
import random
# import requests # No longer needed, replaced by google.generativeai

import numpy as np
from PIL import Image, ImageDraw, ImageFont
import matplotlib
import matplotlib.cm  # Import cm for colormaps
import matplotlib.pyplot as plt

import torch
import torch.nn as nn
from torchvision import transforms, models

from captum.attr import IntegratedGradients

import uvicorn
from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel

# NEW: Correct import for the Google AI library
import google.generativeai as genai

# --- Configuration ---
MODEL_PATH = Path("./outputs/global_model.pth")
INPUT_SIZE = 224
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# LLM Configuration (NEW - Updated)
LLM_API_KEY = "AIzaSyCBAO4NJCIhLvG5Yno7Vn0uuOvMQ_LreHY"  # User must replace this
LLM_MODEL = "gemini-2.5-flash"  # Example multimodal model


# --- Response Model ---
class PredictionResponse(BaseModel):
    """Pydantic model for the API response."""
    prediction: str
    confidence: float
    description: str
    gradcam_image_base64: str  # We keep the name for API consistency
    llm_response: str  # Optional field for LLM response

# --- Helper Functions (from notebook) ---

# Disease Descriptions (from notebook)
disease_descriptions = {
    "Healthy": "Normal eye appearance without signs of pathology.",
    "Healthy [Color Fundus]": "Normal eye appearance without signs of pathology.",
    "Diabetic Retinopathy": "Retinal blood vessel damage due to diabetes; may show hemorrhages or exudates.",
    "Diabetic Retinopathy [Color Fundus]": "Retinal blood vessel damage due to diabetes; may show hemorrhages or exudates.",
    "Glaucoma": "Damage to the optic nerve often associated with raised intraocular pressure.",
    "Glaucoma [Color Fundus]": "Damage to the optic nerve often associated with raised intraocular pressure.",
    "Retinitis Pigmentosa": "Genetic retinal degeneration causing progressive peripheral vision loss.",
    "Retinitis Pigmentosa [Color Fundus]": "Genetic retinal degeneration causing progressive peripheral vision loss.",
    "Retinal Detachment": "Separation of retina from underlying tissue; medical emergency.",
    "Retinal Detachment [Color Fundus]": "Separation of retina from underlying tissue; medical emergency.",
    "Pterygium": "Benign growth of conjunctiva extending over the cornea, often due to UV exposure.",
    "Pterygium [Color Fundus]": "Benign growth of conjunctiva extending over the cornea, often due to UV exposure.",
    "Myopia": "Nearsightedness — structural axial elongation of the eye causing blurred distance vision.",
    "Myopia [Color Fundus]": "Nearsightedness — structural axial elongation of the eye causing blurred distance vision.",
    "Macular Scar": "Scarring in the macula leading to central vision loss.",
    "Macular Scar [Color Fundus]": "Scarring in the macula leading to central vision loss.",
    "Disc Edema": "Swelling of the optic disc, possibly due to raised intracranial pressure or inflammation.",
    "Disc Edema [Color Fundus]": "Swelling of the optic disc, possibly due to raised intracranial pressure or inflammation.",
    "Central Serous Chorioretinopathy": "Fluid accumulation beneath the retina causing focal blurring; often self-limiting.",
    "Central Serous Chorioretinopathy [Color Fundus]": "Fluid accumulation beneath the retina causing focal blurring; often self-limiting."
}

# Validation Transform (from notebook)
val_transform = transforms.Compose([
    transforms.Resize(int(INPUT_SIZE*1.1)),
    transforms.CenterCrop(INPUT_SIZE),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225])
])

# Overlay Helper (from notebook)
def apply_colormap_on_image(org_im, activation, colormap_name='jet'):
    """
    Applies a colormap heatmap to an image.
    """
    colormap = matplotlib.colormaps[colormap_name]
    heatmap = colormap(activation)[:,:,:3]  # HxWx3
    heatmap = (heatmap * 255).astype('uint8')
    heatmap_pil = Image.fromarray(heatmap).resize(org_im.size, resample=Image.BILINEAR)
    heatmap_np = np.array(heatmap_pil).astype(float)/255.0
    org_np = np.array(org_im).astype(float)/255.0
    overlay = 0.6 * org_np + 0.4 * heatmap_np
    overlay = np.clip(overlay, 0, 1)
    overlay_img = Image.fromarray((overlay*255).astype('uint8'))
    return overlay_img

# LLM Report Generator (NEW - Updated to use google-generativeai)
def get_report_from_llm(pred_name, conf, desc, pil_image):
    """
    Sends data to the Gemini LLM API and gets a structured text report.
    Simulates if API key is not set.
    """
    if not LLM_API_KEY or LLM_API_KEY == "YOUR_GEMINI_API_KEY_HERE":
        print("Simulating LLM API call (API key not set)...")
        simulated_report = {
            "report_id": f"rep_sim_{random.randint(1000, 9999)}",
            "findings": f"The model detected {pred_name} with {conf*100:.1f}% confidence.",
            "interpretation": f"Based on the heatmap, key features indicating {pred_name} were observed (simulated).",
            "recommendation": "Consult a specialist for further diagnosis (simulated)."
        }
        return simulated_report

    try:
        model = genai.GenerativeModel(LLM_MODEL)
        
        prompt = f"""
        You are a medical assistant AI. Analyze the following ophthalmology report.
        The model prediction is '{pred_name}' with {conf*100:.1f}% confidence.
        Description: {desc}
        The attached image is an Integrated Gradients heatmap showing the features the model used for this prediction.
        
        Please provide a brief, professional summary for a medical log in JSON format.
        Example:
        {{
          "finding": "...",
          "interpretation": "...",
          "recommendation": "..."
        }}
        Give recommendations based on standard medical practices and it must have atleast 150 words.
        """
        
        response = model.generate_content([prompt, pil_image])
        
        # Try to parse the JSON response from the LLM
        # A more robust solution would handle potential markdown formatting
        report_text = response.text.strip().lstrip("```json").rstrip("```")
        llm_report = json.loads(report_text)
        llm_report["report_id"] = f"rep_api_{random.randint(1000, 9999)}"
        
        print("Received LLM Report:", llm_report)
        return llm_report

    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        # Fallback to simulation on error
        return {
            "report_id": f"rep_err_{random.randint(1000, 9999)}",
            "error": f"Failed to generate LLM report: {str(e)}",
            "findings": f"The model detected {pred_name} with {conf*100:.1f}% confidence.",
            "recommendation": "Consult a specialist for further diagnosis (simulated)."
        }


# --- Load Model and Explainability Tool on Startup ---

def load_model_components():
    """Loads the model, class names, and Integrated Gradients instance."""
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model checkpoint not found at {MODEL_PATH}")

    # Load checkpoint to get class names
    checkpoint = torch.load(MODEL_PATH, map_location=DEVICE)
    class_names = ["Central Serous Chorioretinopathy", "Diabetic Retinopathy",
                   "Glaucoma", "Healthy", "Myopia", "Retinitis Pigmentosa"]
    if not class_names:
        raise KeyError("Checkpoint does not contain 'class_names'.")
    num_classes = len(class_names)

    # Initialize model architecture
    model = models.resnet18(weights=None)
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    
    # Load the saved state dict
    model.load_state_dict(checkpoint)
    model.to(DEVICE)
    model.eval()

    # Initialize Integrated Gradients
    ig_instance = IntegratedGradients(model)
    
    print(f"Model loaded successfully. Device: {DEVICE}. Classes: {num_classes}")
    return model, ig_instance, class_names

app = FastAPI(title="Eye Disease Classifier API")

# --- Configure LLM API on startup ---
try:
    if LLM_API_KEY and LLM_API_KEY != "YOUR_GEMINI_API_KEY_HERE":
        genai.configure(api_key=LLM_API_KEY)
        print("Gemini API configured successfully.")
    else:
        print("Gemini API key not found. LLM reports will be simulated.")
except Exception as e:
    print(f"Warning: Could not configure Gemini API. LLM reports will be disabled. Error: {e}")

# Load model and IG instance
model, ig, class_names = load_model_components()


# --- API Endpoint ---

@app.post("/predict/", response_model=PredictionResponse)
async def predict_image(file: UploadFile = File(...)):
    """
    Receives an image, performs classification, generates Integrated Gradients,
    and returns prediction details with the heatmap overlay image.
    """
    # Read and process the image
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    
    # Transform image for the model
    inp = val_transform(img).unsqueeze(0).to(DEVICE)

    # --- Run standard inference first ---
    with torch.no_grad():
        out = model(inp)
        probs = torch.softmax(out, dim=1).cpu().numpy()[0]
        pred_idx = int(probs.argmax())
        pred_name = class_names[pred_idx]
        conf = float(probs[pred_idx])

    # --- Generate Integrated Gradients explanation ---
    # Create a black image as a baseline
    baseline = torch.zeros_like(inp).to(DEVICE)
    
    # Calculate attributions using IG
    attributions = ig.attribute(inp, target=pred_idx, baselines=baseline, n_steps=50)
    
    # Process attributions for visualization
    attr_np = attributions.squeeze(0).cpu().detach().numpy()
    # Sum absolute attributions across color channels to get a 2D heatmap
    heatmap_np = np.abs(attr_np).sum(axis=0)
    # Normalize to [0, 1]
    heatmap_np = (heatmap_np - heatmap_np.min()) / (heatmap_np.max() - heatmap_np.min() + 1e-8) # Add epsilon for stability

    # --- Create the overlay image (WITHOUT annotation banner) ---
    overlay_img = apply_colormap_on_image(img.resize((INPUT_SIZE, INPUT_SIZE)), heatmap_np)
    desc = disease_descriptions.get(pred_name, "No description available.")

    # --- (Optional) Call the new LLM function ---
    # This now passes the PIL image `overlay_img` directly.
    # It will simulate unless you add your API key at the top.
    llm_report = get_report_from_llm(pred_name, conf, desc, overlay_img)
    # print("Generated LLM Report:", llm_report)
    # -----------------------------------------------------

    # Convert overlay image to base64 string for the API response
    buffered = io.BytesIO()
    overlay_img.save(buffered, format="JPEG") # Save the overlay image directly
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    # Return the JSON response
    return PredictionResponse(
        prediction=pred_name,
        confidence=conf,
        description=desc,
        gradcam_image_base64=img_str,
        llm_response=json.dumps(llm_report)  # Convert dict to JSON string
    )

@app.get("/")
def read_root():
    return {"message": "Welcome to the Eye Disease Classifier API. POST an image to /predict/."}

# --- Run the App ---
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)