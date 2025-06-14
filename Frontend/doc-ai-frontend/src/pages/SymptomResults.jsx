import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const HighRiskAlert = ({ onClose, onBookAppointment }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">High Risk Alert!</h3>
          <p className="text-sm text-gray-500 mb-4">
            Based on your symptoms, we strongly recommend seeking immediate medical attention.
          </p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={onBookAppointment}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Book Appointment Now
            </button>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SymptomResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showHighRiskAlert, setShowHighRiskAlert] = useState(false);

  const data = location.state || {};
  const modelOutput = data.modelOutput || data;
  const patientInfo = data.patientInfo || {};
  const selectedSymptoms = data.selectedSymptoms || [];
  const additionalSymptoms = data.additionalSymptoms || '';

  useEffect(() => {
    if (modelOutput?.predicted_risk?.toLowerCase() === 'high') {
      setShowHighRiskAlert(true);
    }
  }, [modelOutput]);

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
      {showHighRiskAlert && (
        <HighRiskAlert
          onClose={() => setShowHighRiskAlert(false)}
          onBookAppointment={() => {
            setShowHighRiskAlert(false);
            navigate('/appointments');
          }}
        />
      )}
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
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-red-700 font-medium">⚠️ High Risk Alert!</p>
              <p className="text-red-600 mt-2 text-sm">Please seek medical attention immediately.</p>
              <button
                onClick={() => navigate('/appointments')}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Book Appointment Now
              </button>
            </div>
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