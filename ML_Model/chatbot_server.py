from flask import Flask, jsonify,request
import time

from chatbot import predict_class, get_response, intents

app = Flask(__name__)

@app.route("/bot", methods=["POST"])
def response():
    query = request.form['query']
    ints = predict_class(query)
    res = get_response(ints, intents)



    return res
if __name__=="__main__":
    app.run(debug=True)