from skimage import io
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from PIL import Image
import numpy as np
import cv2

# img = Image.open("./imagedataset/val/NORMAL/NORMAL2-IM-1427-0001.jpeg")
# imgArray = np.array(img)
# print(imgArray/255)
# val_dir = './imagedataset/val'

img_size = 224
img_arr = cv2.imread("./Tuberculosis/Test/Tuberculosis/Tuberculosis-563.png")[...,::-1] #convert BGR to RGB format
# img_arr = cv2.imread("./just-for-you-15379525664881_1200x.jpg")[...,::-1] #convert BGR to RGB format
# img_arr = io.imread("./Tuberculosis/Test/Tuberculosis/Tuberculosis-595.png")
resized_arr = cv2.resize(img_arr, (img_size, img_size)) # Reshaping images to preferred size
imgArray = np.array(resized_arr) / 255
imgArray = imgArray.reshape(-1, img_size, img_size, 3)

#
# imgShape = (224,224)
# val_dir = './imagedataset/val'
# test_datagen = ImageDataGenerator(rescale=1./255.)
# test_generator = test_datagen.flow_from_directory(val_dir, shuffle=False, batch_size=20, class_mode = 'binary', target_size=imgShape)
#
# y_true = test_generator.classes
# print(y_true)

model = load_model('tuberc_model')
pred = model.predict(imgArray)
print(pred)

y_pred = []
for i in pred:
    if i >= 0.6:
        y_pred.append(1)
    elif i <= 0.45:
        y_pred.append(0)
    else:
        y_pred = "Cannot Classify this image"

print(y_pred)