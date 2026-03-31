import os
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras import layers, models
from sklearn.model_selection import train_test_split
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

def load_data(data_path, img_size=(128, 128)):
    data, labels = [], []
    fire_path = os.path.join(data_path, 'Fire images')
    no_fire_path = os.path.join(data_path, 'Normal Images')
    if not os.path.exists(fire_path) or not os.path.exists(no_fire_path):
        raise FileNotFoundError("Dataset folders not found.")
    for category, label in [(fire_path, 1), (no_fire_path, 0)]:
        for filename in os.listdir(category):
            filepath = os.path.join(category, filename)
            img = cv2.imread(filepath)
            if img is None:
                continue
            try:
                img = cv2.resize(img, img_size) / 255.0
                data.append(img)
                labels.append(label)
            except:
                continue
    if len(data) == 0:
        raise ValueError("No valid images found in dataset.")
    return np.array(data), np.array(labels)

def train_model(data_path="dataset", img_size=(128, 128)):
    X, y = load_data(data_path, img_size)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    datagen = ImageDataGenerator(rotation_range=15, width_shift_range=0.1,
                                 height_shift_range=0.1, zoom_range=0.1, horizontal_flip=True)
    datagen.fit(X_train)
    base_model = MobileNetV2(input_shape=(128, 128, 3), include_top=False, weights="imagenet")
    base_model.trainable = False
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(128, activation="relu"),
        layers.Dropout(0.5),
        layers.Dense(1, activation="sigmoid")
    ])
    model.compile(optimizer=Adam(learning_rate=0.001),
                  loss="binary_crossentropy",
                  metrics=["accuracy"])
    callbacks = [
        EarlyStopping(patience=5, restore_best_weights=True),
        ModelCheckpoint("best_fire_model.h5", save_best_only=True)
    ]
    model.fit(datagen.flow(X_train, y_train, batch_size=32),
              validation_data=(X_test, y_test),
              epochs=15,
              callbacks=callbacks,
              verbose=1)
    model.save("fire_detection_model_mobilenet.h5")

if __name__ == "__main__":
    train_model(data_path="P:\\project\\dataset")
