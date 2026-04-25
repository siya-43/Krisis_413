from ultralytics import YOLO

# Load model once (VERY IMPORTANT)
model = YOLO("best.pt")  # your trained model

def detect_objects(image):
    results = model(image)

    detected = {
        "smoke": False,
        "fire": False
    }

    for r in results:
        for box in r.boxes:
            cls = int(box.cls[0])
            label = model.names[cls]

            if label == "smoke":
                detected["smoke"] = True
            if label == "fire":
                detected["fire"] = True

    return detected
