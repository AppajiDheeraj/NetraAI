from fastapi import APIRouter, UploadFile, File
from app.ml.analyzer import analyze_image
import shutil
import uuid
import os

router = APIRouter()

@router.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    temp_path = f"/tmp/{uuid.uuid4()}.jpg"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = analyze_image(temp_path)
    os.remove(temp_path)
    return result
