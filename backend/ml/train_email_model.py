import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# Load dataset
df = pd.read_csv(
    "data/sms.tsv",
    sep="\t",
    header=None,
    names=["label", "message"]
)

# Convert labels
df["label"] = df["label"].map({
    "ham": 0,
    "spam": 1
})

# Features & Labels
X = df["message"]
y = df["label"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# TF-IDF
vectorizer = TfidfVectorizer()

X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# Model
model = LogisticRegression(
    max_iter=2000,
    class_weight="balanced"
)

model.fit(X_train_vec, y_train)

# Prediction
predictions = model.predict(X_test_vec)

accuracy = accuracy_score(y_test, predictions)

print(f"Accuracy: {accuracy:.4f}")

# Save
joblib.dump(model, "models/email_model.pkl")
joblib.dump(vectorizer, "models/vectorizer.pkl")

print("Model saved!")