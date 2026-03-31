
# 🔥 Fire Detection System using MobileNetV2 + OpenCV

## 📌 Overview
This project is a **real-time fire detection system** built using **MobileNetV2 (TensorFlow/Keras)** for deep learning and **OpenCV** for computer vision.  
It can detect fire in images, videos, or live webcam feeds with high accuracy.


## 🚀 Features
- ✅ Trainable model (binary classification: **Fire / No Fire**)  
- ✅ Preprocessing: image resizing, normalization, augmentation  
- ✅ Model optimization with **EarlyStopping** & **ModelCheckpoint**  
- ✅ Real-time detection with **OpenCV** (webcam/video feed)  
- ✅ Saved model weights for reusability (`.h5` files)  


## 🛠️ Tech Stack
- **Python 3.10+**
- **TensorFlow / Keras**
- **OpenCV**
- **NumPy, Matplotlib, scikit-learn**


## 📂 Project Structure
```bash
project/
│── dataset/ # Training dataset (Fire / NoFire folders)
│ ├── Fire/
│ └── NoFire/
│── fire_detection_model.py # Script for training MobileNetV2 model
│── fire_detection_app.py # Real-time detection using trained model
│── best_fire_model.h5 # Saved trained model (example)
│── fire_detection_model_mobilenet.h5 # Another trained model version
│── requirements.txt # Dependencies
│── .gitignore
│── LICENSE
│── README.md
```
---

## ▶️ How to Run
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/fire-detection-mobilenet.git
cd fire-detection-mobilenet
```
### 2️⃣ Setup Virtual Environment
python -m venv venv
venv\Scripts\activate     # On Windows

### 3️⃣ Install Dependencies
pip install -r requirements.txt

### 4️⃣ Dataset Setup

Place your dataset inside the dataset/ folder with this structure:

dataset/
├── Fire/
└── NoFire/

### 5️⃣ Train the Model
python fire_detection_model.py


This will train MobileNetV2 and save the best model as .h5.

### 6️⃣ Run Real-Time Fire Detection
python fire_detection_app.py


Opens your webcam/video feed

Detects Fire / No Fire in real time

## 📊 Results

Model Accuracy: 92%+ on custom dataset

Fast inference with MobileNetV2

Alerts when fire is detected in video stream

## 👤 Author
Nirjana Das

GitHub:nirjanadas
