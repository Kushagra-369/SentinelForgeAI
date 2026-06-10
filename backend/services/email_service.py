import joblib

model = joblib.load("ml/models/email_model.pkl")
vectorizer = joblib.load("ml/models/vectorizer.pkl")


def scan_email(text: str):
    text_vector = vectorizer.transform([text])

    probability = model.predict_proba(text_vector)[0]

    spam_probability = float(probability[1])

    return {
        "is_spam": spam_probability >= 0.40,
        "confidence": round(spam_probability * 100, 2)
    }