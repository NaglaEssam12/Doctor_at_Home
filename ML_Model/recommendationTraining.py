import pickle

import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OrdinalEncoder
from sklearn.svm import LinearSVC
from sklearn.metrics import accuracy_score
from sklearn.tree import DecisionTreeClassifier

df = pd.read_csv("respiratory symptoms and treatment.csv")
df = df.dropna()
ageList = df['Treatment'].unique().tolist()
ageList = sorted(ageList)
print(len(ageList))
#
# for i in range(len(ageList)):
#     ageList[i] = int(ageList[i])
#     ageList[i] = str(ageList[i])
#
# print(ageList)

X = df.drop(columns=['Treatment'])
y = df['Treatment']

X_train,X_test,y_train,y_test = train_test_split(X, y, test_size=0.33, random_state=42)
text_clf = Pipeline([('od', OrdinalEncoder()),
                     ('clf', DecisionTreeClassifier()),])

text_clf.fit(X_train,y_train)


predictions = text_clf.predict([['chest pain',80.0,'male','Mesothelioma','high']])[0]
print(predictions)
# print(accuracy_score(y_test,predictions))
#
# filename = 'recommendation_model'
# pickle.dump(text_clf, open(filename, 'wb'))
#
# loaded_model = pickle.load(open('recommendation_model', 'rb'))
# print(loaded_model.predict([['chest pain',80,'male','Mesothelioma','high']])[0])




