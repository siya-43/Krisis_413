from fastapi import FastAPI, UploadFile, File
import cv2
import numpy as np
from model import detect_objects

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Backend Running 🚀"}

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    contents = await file.read()

    # Convert to OpenCV image
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    result = detect_objects(img)

    return result
