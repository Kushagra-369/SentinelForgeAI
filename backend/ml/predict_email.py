import joblib

# Load trained model
model = joblib.load("models/email_model.pkl")
vectorizer = joblib.load("models/vectorizer.pkl")

# User input
email = input("Enter message: ")

# Convert text to vector
email_vector = vectorizer.transform([email])

# Prediction
prediction = model.predict(email_vector)[0]

# Confidence scores
probability = model.predict_proba(email_vector)[0]

spam_probability = probability[1]

# Custom threshold
if spam_probability >= 0.40:
    print(f"\nSPAM DETECTED ({spam_probability * 100:.2f}%)")
else:
    print(f"\nSAFE MESSAGE ({probability[0] * 100:.2f}%)")

print("\nRaw Probabilities:")
print(probability)