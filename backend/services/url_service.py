import joblib
from utils.url_features import extract_features

model = joblib.load("ml/models/url_model.pkl")

def get_url_reasons(url: str, malicious_probability: float):
    reasons = []

    url_lower = url.lower()

    if "login" in url_lower:
        reasons.append("Contains login keyword")

    if "secure" in url_lower:
        reasons.append("Contains secure keyword")

    if "verify" in url_lower:
        reasons.append("Contains verify keyword")

    if "account" in url_lower:
        reasons.append("Contains account keyword")

    if "bank" in url_lower:
        reasons.append("Contains banking-related keyword")

    if url.count("-") >= 2:
        reasons.append("Multiple hyphens detected")

    if ".xyz" in url_lower:
        reasons.append("High-risk TLD (.xyz)")

    if len(url) > 50:
        reasons.append("Unusually long URL")

    if malicious_probability >= 0.85:
        reasons.append("Strong phishing confidence score")

    return reasons

def scan_url(url: str):
    features = list(extract_features(url).values())

    probability = model.predict_proba([features])[0]

    malicious_probability = float(probability[1])

    # Risk Level
    if malicious_probability < 0.30:
        risk_level = "SAFE"
    elif malicious_probability < 0.60:
        risk_level = "MEDIUM"
    elif malicious_probability < 0.85:
        risk_level = "HIGH"
    else:
        risk_level = "CRITICAL"

    return {
        "is_malicious": malicious_probability >= 0.50,
        "confidence": round(malicious_probability * 100, 2),
        "risk_level": risk_level,
        "reasons": get_url_reasons(
            url,
            malicious_probability
        )
    }