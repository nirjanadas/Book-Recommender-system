import os
import cv2
import numpy as np
import tensorflow as tf

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'


model_path = "fire_detection_model_mobilenet.h5"
if not os.path.exists(model_path):
    raise FileNotFoundError(f"❌ Model file not found: {model_path}")

print("✅ Model loaded successfully")
model = tf.keras.models.load_model(model_path)


cap = cv2.VideoCapture(0)
if not cap.isOpened():
    raise RuntimeError("❌ Could not open webcam")

img_size = (128, 128)
confidence_threshold = 0.7

print("🚀 Fire detection started (press 'q' to quit)")

while True:
    ret, frame = cap.read()
    if not ret:
        print("⚠️ Failed to grab frame")
        break

    try:
        resized_frame = cv2.resize(frame, img_size) / 255.0
        input_frame = np.expand_dims(resized_frame, axis=0)

        prediction = model.predict(input_frame, verbose=0)[0][0]

        if prediction > confidence_threshold:
            label = "🔥 Fire Detected"
            color = (0, 0, 255)
        else:
            label = "✅ No Fire"
            color = (0, 255, 0)

        cv2.putText(frame, f"{label} ({prediction:.2f})",
                    (10, 30), cv2.FONT_HERSHEY_SIMPLEX,
                    1, color, 2)

        cv2.imshow("Fire Detection", frame)

    except Exception as e:
        print(f"⚠️ Error during prediction: {e}")


    if cv2.waitKey(1) & 0xFF == ord("q"):
        break


cap.release()
cv2.destroyAllWindows()
tf.keras.backend.clear_session()
print("✅ Fire detection stopped")
