import pickle

import cv2
from skimage import io
import numpy as np
from tensorflow.keras.models import load_model
from flask import Flask, jsonify,request
import time

from chatbot import predict_class, get_response, intents


app = Flask(__name__)
img_size = 224

model = load_model('tuberc_model')
model2 = load_model('model2')

loaded_model = pickle.load(open('recommendation_model', 'rb'))

def convertToList(string):
    li = list(string.split("-"))
    li[1] = int(li[1])
    return li


@app.route("/tuberc", methods=["POST"])
def response():
    query = request.files['file']
    res = query
    res.save(res.filename)

    img_arr = cv2.imread(res.filename)[...,::-1]  # convert BGR to RGB format
    resized_arr = cv2.resize(img_arr, (img_size, img_size))  # Reshaping images to preferred size
    imgArray = np.array(resized_arr) / 255
    imgArray = imgArray.reshape(-1, img_size, img_size, 3)

    pred = model.predict(imgArray)
    print(pred)

    # if pred >= 0.5:
    #     diagnosis = "Tuberculosis"
    # else:
    #     diagnosis = "Normal"

    if pred >= 0.6:
        diagnosis = "Tuberculosis"
    elif pred <= 0.45:
        diagnosis = "Normal"
    else:
        diagnosis = "Cannot Classify this image"


    return diagnosis

@app.route("/bot", methods=["POST"])
def response4():
    query = request.form['query']
    ints = predict_class(query)
    res = get_response(ints, intents)

    return res

@app.route("/pne", methods=["POST"])
def response2():
    query = request.files['file']
    res = query
    res.save(res.filename)

    img_arr = cv2.imread(res.filename)[...,::-1]  # convert BGR to RGB format
    resized_arr = cv2.resize(img_arr, (img_size, img_size))  # Reshaping images to preferred size
    imgArray = np.array(resized_arr) / 255
    imgArray = imgArray.reshape(-1, img_size, img_size, 3)

    pred = model2.predict(imgArray)
    print(pred)
    #
    # if pred >= 0.5:
    #     diagnosis = "Pneumonia"
    # else:
    #     diagnosis = "Normal"

    if pred >= 0.6:
        diagnosis = "Pneumonia"
    elif pred <= 0.45:
        diagnosis = "Normal"
    else:
        diagnosis = "Cannot Classify this image"

    return diagnosis

@app.route("/rec", methods=["POST"])
def response3():
    query = request.form['query']
    query = convertToList(query)
    # print(query)
    diagnosis = loaded_model.predict([query])[0]
    print(diagnosis)

    return diagnosis

if __name__=="__main__":
    app.run(host="localhost",port=7000,debug=True)