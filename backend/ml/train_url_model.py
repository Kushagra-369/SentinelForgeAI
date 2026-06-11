
import sys
import os

sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)
import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier
from utils.url_features import extract_features


df = pd.read_csv("ml/url_dataset.csv")

X = []
for url in df["url"]:
    X.append(list(extract_features(url).values()))

y = df["label"]

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X, y)

joblib.dump(model, "ml/models/url_model.pkl")

print("URL model saved!")
