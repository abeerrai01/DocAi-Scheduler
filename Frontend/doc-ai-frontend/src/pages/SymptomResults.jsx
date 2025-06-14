import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SymptomResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state || {};
  const modelOutput = data.modelOutput || data;
  const patientInfo = data.patientInfo || {};
  const selectedSymptoms = data.selectedSymptoms || [];
  const additionalSymptoms = data.additionalSymptoms || '';

  if (!modelOutput || !modelOutput.input_symptoms) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">No Results Found</h1>
          <p className="text-gray-600 mt-2">Please check your symptoms again.</p>
          <button
            onClick={() => navigate('/symptom-checker')}
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getSeverityColor = (risk) => {
    if (!risk) return 'text-gray-600';
    switch (risk.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
      case 'moderate':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Symptom Analysis Results</h1>
          <p className="text-lg text-gray-600 mt-2">Here's what our AI thinks 👇</p>
        </div>

        {/* Patient Info */}
        {(patientInfo.name || patientInfo.age || patientInfo.pincode) && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900">Patient Information</h2>
            <ul className="text-gray-700 mt-2 text-sm space-y-1">
              {patientInfo.name && <li><strong>Name:</strong> {patientInfo.name}</li>}
              {patientInfo.age && <li><strong>Age:</strong> {patientInfo.age}</li>}
              {patientInfo.pincode && <li><strong>Pincode:</strong> {patientInfo.pincode}</li>}
            </ul>
          </div>
        )}

        {/* Symptoms List */}
        {(selectedSymptoms.length > 0 || additionalSymptoms) && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900">Symptoms Selected</h2>
            <ul className="list-disc list-inside mt-2 text-sm text-gray-700 space-y-1">
              {selectedSymptoms.map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
              {additionalSymptoms && <li><strong>Other:</strong> {additionalSymptoms}</li>}
            </ul>
          </div>
        )}

        {/* Input Symptoms */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">Input Symptoms (Raw)</h2>
          <p className="text-gray-700 mt-2">{modelOutput.input_symptoms}</p>
        </div>

        {/* Predicted Risk */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">Predicted Risk Level</h2>
          <p className={`text-lg font-semibold mt-2 ${getSeverityColor(modelOutput.predicted_risk)}`}>
            {modelOutput.predicted_risk || 'Unknown'}
          </p>
          {modelOutput.predicted_risk?.toLowerCase() === 'high' && (
            <p className="text-red-600 mt-2 text-sm">⚠️ Please seek medical attention immediately.</p>
          )}
        </div>

        {/* Confidence Score */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">Model Confidence</h2>
          <p className="text-gray-700 mt-2">{modelOutput.confidence ? `${modelOutput.confidence}%` : 'N/A'}</p>
        </div>

        {/* Treatment Suggestions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">Suggested Treatment</h2>
          {modelOutput.treatment ? (
            <ul className="list-disc list-inside mt-2 text-sm text-gray-700">
              {modelOutput.treatment.split(',').map((t, i) => (
                <li key={i}>{t.trim()}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 mt-2">No treatment suggestions available.</p>
          )}
        </div>

        {/* Doctor Recommendation */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">Doctor Recommendation</h2>
          <p className="text-gray-700 mt-2">
            {modelOutput.recommend_doctor || 'No specific doctor recommended.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/symptom-checker')}
            className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Check Again
          </button>
          <button
            onClick={() => navigate('/appointments')}
            className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            Book Appointment
          </button>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
          <p className="text-sm text-yellow-800">
            ⚠️ This is an AI prediction for educational purposes only. Please consult a healthcare provider for professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SymptomResults;
