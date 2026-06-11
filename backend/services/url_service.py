import joblib
from utils.url_features import extract_features

model = joblib.load("ml/models/url_model.pkl")


def scan_url(url: str):
    features = list(extract_features(url).values())

    probability = model.predict_proba([features])[0]

    malicious_probability = float(probability[1])

    return {
        "is_malicious": malicious_probability >= 0.50,
        "confidence": round(malicious_probability * 100, 2)
    }