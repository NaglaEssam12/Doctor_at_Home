import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.optimizers import RMSprop
from tensorflow.keras.preprocessing.image import ImageDataGenerator

from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Sequential
from tensorflow.keras.optimizers import Adam
import cv2
import pickle
from sklearn.metrics import classification_report, confusion_matrix

import matplotlib.pyplot as plt
# import seaborn as sn


train_dir = './imagedataset/train'
test_dir = './imagedataset/test'
val_dir = './imagedataset/val'

labels = ['Normal', 'Pneumonia']
img_size = 224
def get_data(data_dir):
    data = []
    for label in labels:
        path = os.path.join(data_dir, label)
        class_num = labels.index(label)
        for img in os.listdir(path):
            try:
                img_arr = cv2.imread(os.path.join(path, img))[...,::-1] #convert BGR to RGB format
                resized_arr = cv2.resize(img_arr, (img_size, img_size)) # Reshaping images to preferred size
                data.append([resized_arr, class_num])
            except Exception as e:
                print(e)
    return np.array(data)


train = get_data(train_dir)
val = get_data(test_dir)

# plt.figure(figsize = (5,5))
# plt.imshow(train[1][0])
# plt.title(labels[train[0][1]])
# plt.show()

x_train = []
y_train = []
x_val = []
y_val = []

for feature, label in train:
  x_train.append(feature)
  y_train.append(label)

for feature, label in val:
  x_val.append(feature)
  y_val.append(label)

# Normalize the data
x_train = np.array(x_train) / 255
x_val = np.array(x_val) / 255

x_train.reshape(-1, img_size, img_size, 1)
y_train = np.array(y_train)

x_val.reshape(-1, img_size, img_size, 1)
y_val = np.array(y_val)

#
# pneumonia_train_images = glob.glob(train_dir+"/PNEUMONIA/*.jpeg")
# normal_train_images = glob.glob(train_dir+"/NORMAL/*.jpeg")
#
# # plt.figure(figsize=(15, 10))
# # plt.pie(x=np.array([len(pneumonia_train_images), len(normal_train_images)]), autopct="%.1f%%", explode=[0.2,0], labels=["pneumonia", "normal"], pctdistance=0.5)
# # plt.title("Type of images and their share in train folder", fontsize=14)
# # plt.show()
imgShape = (224,224)
train_datagen = ImageDataGenerator(rescale=1./255.)
test_datagen = ImageDataGenerator(rescale=1./255.)
val_datagen = ImageDataGenerator(rescale=1./255.)


train_generator = train_datagen.flow_from_directory(train_dir, batch_size=20, class_mode='binary', target_size = imgShape)
test_generator = test_datagen.flow_from_directory(val_dir,shuffle=False, batch_size=20, class_mode = 'binary', target_size=imgShape)
validation_generator = val_datagen.flow_from_directory(test_dir, batch_size=20, class_mode = 'binary', target_size=imgShape)

pickle.dump(train_generator, open('train.pkl', 'wb'))
pickle.dump(test_generator, open('test.pkl', 'wb'))
pickle.dump(validation_generator, open('val.pkl', 'wb'))

print('DONE!')


input_shape = (224, 224, 3)

base_model = tf.keras.applications.ResNet50V2(weights='imagenet', input_shape=input_shape, include_top=False)

for layer in base_model.layers:
    layer.trainable = False

model = Sequential()
model.add(base_model)
model.add(GlobalAveragePooling2D())
model.add(Dense(128, activation='relu'))
model.add(Dropout(0.2))
model.add(Dense(1, activation='sigmoid'))
model.summary()

model.compile(optimizer="adam", loss='binary_crossentropy', metrics=["accuracy"])

callback = tf.keras.callbacks.EarlyStopping(monitor='accuracy', patience=4)

history = model.fit(x_train,y_train, validation_data=(x_val,y_val),batch_size=60 ,steps_per_epoch = 50, epochs=20, callbacks=callback)


model.save("model2")

accuracy = history.history['accuracy']
val_accuracy  = history.history['val_accuracy']

loss = history.history['loss']
val_loss = history.history['val_loss']

plt.figure(figsize=(15,10))

plt.subplot(2, 2, 1)
plt.plot(accuracy, label = "Training accuracy")
plt.plot(val_accuracy, label="Validation accuracy")
plt.ylim(0.8, 1)
plt.legend()
plt.title("Training vs validation accuracy")

plt.subplot(2,2,2)
plt.plot(loss, label = "Training loss")
plt.plot(val_loss, label="Validation loss")
plt.ylim(0, 0.5)
plt.legend()
plt.title("Training vs validation loss")

plt.show()