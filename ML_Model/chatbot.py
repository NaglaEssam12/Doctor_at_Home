import random
import json
import pickle
from skimage import io

import cv2
import numpy as np
import nltk
import requests
from PIL import Image
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import load_model

lemmatizer = WordNetLemmatizer()

# intents = json.loads(open('intents.json').read())
intents = json.loads(open('Intents_v1.json',encoding="utf8").read())

words = pickle.load(open('words.pkl','rb'))
classes = pickle.load(open('classes.pkl','rb'))
model = load_model('chatbot_model.h5')

def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word) for word in sentence_words]
    return sentence_words

def bag_of_words(sentence):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for w in sentence_words:
        for i, word in enumerate(words):
            if word == w:
                bag[i] = 1
    return np.array(bag)

def predict_class(sentence):
    bow = bag_of_words(sentence)
    res = model.predict(np.array([bow]))[0]
    Err_Threshold = 0.7
    results = [[i,r] for i, r in enumerate(res) if r > Err_Threshold]

    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({'intent': classes[r[0]], 'probability': str(r[1])})
    # if len(return_list) == 0:
    #     return_list.append({'intent': 'UnExpected', 'probability': '0.2'})
    return return_list

def get_response(intents_list, intents_json):
    list = ['Sorry, Could not understand your question','Sorry, I Do not know what that is :(',"I don't know what you mean by that"]
    if len(intents_list) == 0:
        return random.choice(list)
    tag = intents_list[0]['intent']
    list_of_intents = intents_json['intents']
    for i in list_of_intents:
        if i['tag'] == tag:
            result = random.choice(i['response'])
            break
    return result

#
# image = io.imread("https://images-na.ssl-images-amazon.com/images/I/81-ShGBC4yL.jpg")
# print(image)

#
# print("Bot is running")
# while True:
#     message = input("")
#     ints = predict_class(message)
#     # if (message == "see ya"):
#     #     res = get_response(ints, intents)
#     #     print(res)
#     #     break
#     res = get_response(ints, intents)
#     print(res)
