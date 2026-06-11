import sys
import os

sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)
import joblib
from utils.url_features import extract_features

model = joblib.load("ml/models/url_model.pkl")

url = input("Enter URL: ")

features = list(
    extract_features(url).values()
)

prediction = model.predict([features])[0]

probability = model.predict_proba([features])[0]

if prediction == 1:
    print(
        f"\nMALICIOUS URL ({probability[1] * 100:.2f}%)"
    )
else:
    print(
        f"\nSAFE URL ({probability[0] * 100:.2f}%)"
    )

print(probability)