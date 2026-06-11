import joblib

model = joblib.load("ml/models/email_model.pkl")
vectorizer = joblib.load("ml/models/vectorizer.pkl")


def get_email_reasons(text: str, spam_probability: float):
    reasons = []

    text_lower = text.lower()

    if "urgent" in text_lower:
        reasons.append("Contains urgent keyword")

    if "free" in text_lower:
        reasons.append("Contains free offer keyword")

    if "win" in text_lower or "winner" in text_lower:
        reasons.append("Contains winning-related language")

    if "prize" in text_lower:
        reasons.append("Contains prize keyword")

    if "click" in text_lower:
        reasons.append("Contains click-to-action language")

    if "call now" in text_lower:
        reasons.append("Contains immediate call request")

    if "claim" in text_lower:
        reasons.append("Contains claim-related language")

    if "congratulations" in text_lower:
        reasons.append("Contains congratulatory spam pattern")

    if spam_probability >= 0.85:
        reasons.append("Strong spam confidence score")

    if len(reasons) == 0:
        reasons.append("No major spam indicators detected")

    return reasons


def scan_email(text: str):
    text_vector = vectorizer.transform([text])

    probability = model.predict_proba(text_vector)[0]

    spam_probability = float(probability[1])

    # Risk Level
    if spam_probability < 0.30:
        risk_level = "SAFE"
    elif spam_probability < 0.60:
        risk_level = "MEDIUM"
    elif spam_probability < 0.85:
        risk_level = "HIGH"
    else:
        risk_level = "CRITICAL"

    return {
        "is_spam": spam_probability >= 0.40,
        "confidence": round(spam_probability * 100, 2),
        "risk_level": risk_level,
        "reasons": get_email_reasons(
            text,
            spam_probability
        )
    }