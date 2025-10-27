from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse
from twilio.rest import Client
import phonenumbers
from reportlab.pdfgen import canvas
from PIL import Image
import io
import base64
import os

app = FastAPI()

# Twilio credentials (use environment variables in production)
from dotenv import load_dotenv
load_dotenv()

TWILIO_SID = os.getenv("TWILIO_SID")
TWILIO_AUTH = os.getenv("TWILIO_AUTH")
TWILIO_WHATSAPP = os.getenv("TWILIO_WHATSAPP")

client = Client(TWILIO_SID, TWILIO_AUTH)

# Dummy ML model function (replace with actual model call)
def analyze_image(file_path):
    with open(file_path, "rb") as f:
        payload = f.read()

    # Simulated response from ML model
    return {
        "prediction": "No signs of disease",
        "confidence": 0.98,
        "description": "The image shows healthy retinal tissue.",
        "gradcam_image_base64": base64.b64encode(payload).decode("utf-8")  # Replace with actual Grad-CAM
    }

# Decode and save base64 image
def save_base64_image(base64_str, output_path):
    image_data = base64.b64decode(base64_str)
    image = Image.open(io.BytesIO(image_data))
    image.save(output_path)
    return output_path

# Validate phone number
def validate_number(raw_number, region='IN'):
    try:
        number = phonenumbers.parse(raw_number, region)
        if phonenumbers.is_valid_number(number):
            return phonenumbers.format_number(number, phonenumbers.PhoneNumberFormat.E164)
    except:
        return None
    return None

# Generate PDF report with image
def generate_report(username, diagnosis, output_path, image_path=None):
    c = canvas.Canvas(output_path)
    c.drawString(100, 750, f"Eye Report for {username}")
    c.drawString(100, 730, f"Disease: {diagnosis['prediction']}")
    c.drawString(100, 710, f"Confidence: {diagnosis['confidence']:.2f}")
    c.drawString(100, 690, f"Description: {diagnosis['description']}")
    if image_path:
        c.drawImage(image_path, 100, 450, width=300, height=200)
    c.save()

# WhatsApp sender
def send_whatsapp(to_number, message, media_url=None):
    client.messages.create(
        from_=TWILIO_WHATSAPP,
        to=f"whatsapp:{to_number}",
        body=message,
        media_url=media_url
    )

@app.post("/submit")
async def submit(
    username: str = Form(...),
    user_phone: str = Form(...),
    doctor_phone: str = Form(...),
    image: UploadFile = Form(...)
):
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("reports", exist_ok=True)

    # Save uploaded image
    image_path = f"uploads/{image.filename}"
    with open(image_path, "wb") as f:
        f.write(await image.read())

    # Run ML model
    result = analyze_image(image_path)

    # Save Grad-CAM image
    gradcam_path = f"uploads/{username}_gradcam.png"
    save_base64_image(result["gradcam_image_base64"], gradcam_path)

    # Generate PDF report
    report_path = f"reports/{username}_report.pdf"
    generate_report(username, result, report_path, gradcam_path)
    report_url = f"https://yourdomain.com/{report_path}"  # Replace with actual URL

    # Validate phone numbers
    user_number = validate_number(user_phone)
    doctor_number = validate_number(doctor_phone)

    if not user_number or not doctor_number:
        return JSONResponse(status_code=400, content={"error": "Invalid phone number(s)"})

    # Send WhatsApp messages
    send_whatsapp(user_number, f"Hi {username}, your eye report is ready.", report_url)
    send_whatsapp(doctor_number, f"New report for {username} available.", report_url)

    return {"status": "Report sent", "diagnosis": result["prediction"]}
