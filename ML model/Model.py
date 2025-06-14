# %%
# full_symptom_triage_api_with_risk.py

from flask import Flask, request, jsonify
import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
import joblib
import os

# ------------------------------
# Load dataset (adjusted for provided columns)
# ------------------------------
df = pd.read_csv("D:\DocAi-Scheduler\ML model\Diseases_Symptoms.csv")  # Make sure this file exists and has columns: Code, Name, Symptoms, Treatments

# ------------------------------
# CLEANING & RISK LABELING
# ------------------------------
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z0-9, ]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

df = df.dropna(subset=['Symptoms', 'Treatments'])
df['Symptoms'] = df['Symptoms'].apply(clean_text)
df['Treatments'] = df['Treatments'].apply(clean_text)

# Add synthetic Risk column using keyword heuristics
def classify_risk(symptoms):
    high_keywords = [
    'chest pain', 'seizure', 'stroke', 'unconscious',
    'shortness of breath', 'palpitation', 'bleeding',
    'confusion', 'heart attack', 'cardiac arrest', 'tight chest','chestpain',
    'shortnessofbreath','heartattack', 'cardiacarrest', 'tightchest'
]

    for kw in high_keywords:
        if kw in symptoms:
            return 'HIGH'
    return 'LOW'

df['Risk'] = df['Symptoms'].apply(classify_risk)
df['Risk_Label'] = df['Risk'].map({'LOW': 0, 'HIGH': 1})

# ------------------------------
# MODEL TRAINING
# ------------------------------
X = df['Symptoms']
y = df['Risk_Label']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

pipeline = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', RandomForestClassifier(n_estimators=100, random_state=42))
])

pipeline.fit(X_train, y_train)
joblib.dump(pipeline, "triage_model.pkl")

# ------------------------------
# FLASK API
# ------------------------------
app = Flask(__name__)
model = joblib.load("triage_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    symptoms = data.get("symptoms", "")
    if not symptoms:
        return jsonify({"error": "No symptoms provided"}), 400

    clean_input = clean_text(symptoms)

    # Use keyword-based override first
    if classify_risk(clean_input) == 'HIGH':
        risk_pred = 1
        proba = 1.0
    else:
        risk_pred = model.predict([clean_input])[0]
        proba = model.predict_proba([clean_input])[0][1]

    # Find closest match for treatments
    match = df[df['Symptoms'].apply(lambda s: any(word in s for word in clean_input.split()))]
    match_row = match.iloc[0] if not match.empty else df.sample(1).iloc[0]

    response = {
        "input_symptoms": symptoms,
        "predicted_risk": "HIGH" if risk_pred else "LOW",
        "treatment": match_row['Treatments'] if risk_pred == 0 else None,
        "recommend_doctor": "Consult Doctor" if risk_pred == 1 else None,
        "confidence": f"{round(proba * 100, 2)}%"
    }
    return jsonify(response)


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host='0.0.0.0', port=port)


# %%
df.head()

# %%



