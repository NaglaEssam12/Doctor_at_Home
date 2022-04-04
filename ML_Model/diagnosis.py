import numpy as np
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn import preprocessing

def removing(list1):
    list1 = set(list1)
    list1.discard('No')
    a = ''.join(list1)
    return a

df = pd.read_csv('Cleaned-Data.csv')

indicators = ['Fever', 'Tiredness', 'Dry-Cough',  'Difficulty-in-Breathing', 'Sore-Throat', 'Pains', 'Nasal-Congestion',
              'Runny-Nose', 'Diarrhea', 'Age_0-9', 'Age_10-19', 'Age_20-24', 'Age_25-59', 'Age_60+', 'Gender_Male',
              'Gender_Female']
target_columns = ['Severity_None']

severity_columns = df.filter(like='Severity_').columns

df['Severity_None'].replace({1:'None',0:'No'},inplace =True)
df['Severity_Mild'].replace({1:'Mild',0:'No'},inplace =True)
df['Severity_Moderate'].replace({1:'Moderate',0:'No'},inplace =True)
df['Severity_Severe'].replace({1:'Severe',0:'No'},inplace =True)

df['Condition'] = df[severity_columns].values.tolist()

df['Condition'] = df['Condition'].apply(removing)

le = preprocessing.LabelEncoder()
df['Condition'] = le.fit_transform(df['Condition'])

target = df['Condition'].to_numpy()      #0 means mild 1 means moderate 2 means none 3 means severe
features = df[indicators].to_numpy()


# print(target.head(10))

x_train, x_test, y_train, y_test = train_test_split(features, target, random_state=42, test_size=.3)

lr = LogisticRegression()
lr.fit(x_train, y_train)
print(lr.score(x_test, y_test))
res = lr.predict(np.array([1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,1]).reshape(1,16))
print(res)

# 1	1	1	1	1	0	1	1	1	1	0	1	0	0	0	0	0	1
