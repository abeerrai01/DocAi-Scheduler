from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app, origins=["https://doc-ai-scheduler.vercel.app", "http://localhost:5173"], supports_credentials=True)

# Load the model
model = joblib.load("triage_model.pkl")

@app.route('/')
def home():
    return "ML API is live on port 5050!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        symptoms = data.get('symptoms', [])
        
        # Convert symptoms to model input format
        # Assuming your model expects a specific format, adjust this accordingly
        features = np.array(symptoms).reshape(1, -1)
        
        # Make prediction
        prediction = model.predict(features)
        probability = model.predict_proba(features)
        
        return jsonify({
            'prediction': prediction.tolist(),
            'probability': probability.tolist(),
            'status': 'success'
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050) 