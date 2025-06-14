import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const commonSymptoms = [
  { id: 'fever', label: 'Fever', description: 'Temperature above 100.4°F (38°C)' },
  { id: 'cough', label: 'Cough', description: 'Dry or wet cough' },
  { id: 'fatigue', label: 'Fatigue', description: 'Feeling tired or exhausted' },
  { id: 'headache', label: 'Headache', description: 'Pain in the head' },
  { id: 'sore_throat', label: 'Sore Throat', description: 'Pain or irritation in the throat' },
  { id: 'shortness_breath', label: 'Shortness of Breath', description: 'Difficulty breathing' },
  { id: 'chest_pain', label: 'Chest Pain', description: 'Pain or discomfort in the chest' },
  { id: 'nausea', label: 'Nausea', description: 'Feeling of sickness' },
  { id: 'vomiting', label: 'Vomiting', description: 'Throwing up' },
  { id: 'diarrhea', label: 'Diarrhea', description: 'Loose, watery stools' }
];

const SymptomChecker = () => {
  const navigate = useNavigate();
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [additionalSymptoms, setAdditionalSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSymptomChange = (symptomId) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptomId)) {
        return prev.filter(id => id !== symptomId);
      } else {
        return [...prev, symptomId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (selectedSymptoms.length === 0 && !additionalSymptoms.trim()) {
      setError('Please select or describe your symptoms');
      setLoading(false);
      return;
    }

    try {
      // Here you would typically make an API call to your backend
      // For now, we'll just simulate a response
      const response = {
        success: true,
        analysis: {
          possibleConditions: ['Common Cold', 'Flu'],
          severity: selectedSymptoms.includes('chest_pain') || selectedSymptoms.includes('shortness_breath') ? 'High' : 'Low',
          recommendations: ['Rest', 'Stay Hydrated']
        }
      };

      if (response.success) {
        // Navigate to results page with the analysis data
        navigate('/symptom-results', { 
          state: { 
            analysis: response.analysis,
            symptoms: {
              selected: selectedSymptoms.map(id => commonSymptoms.find(s => s.id === id)?.label).join(', '),
              additional: additionalSymptoms
            }
          }
        });
      } else {
        setError('Failed to analyze symptoms. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Symptom check error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Symptom Checker
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Select your symptoms and get AI-powered health insights
          </p>
        </div>

        <div className="mt-12">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {error && (
                <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Common Symptoms */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Common Symptoms</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {commonSymptoms.map((symptom) => (
                      <div
                        key={symptom.id}
                        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                      >
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            id={symptom.id}
                            checked={selectedSymptoms.includes(symptom.id)}
                            onChange={() => handleSymptomChange(symptom.id)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <label
                            htmlFor={symptom.id}
                            className="text-sm font-medium text-gray-700"
                          >
                            {symptom.label}
                          </label>
                          <p className="text-xs text-gray-500">
                            {symptom.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Symptoms */}
                <div>
                  <label htmlFor="additionalSymptoms" className="block text-sm font-medium text-gray-700">
                    Additional Symptoms
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="additionalSymptoms"
                      name="additionalSymptoms"
                      rows={4}
                      value={additionalSymptoms}
                      onChange={(e) => setAdditionalSymptoms(e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Describe any other symptoms you're experiencing..."
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Please be as detailed as possible about your symptoms, including their duration and severity.
                  </p>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Analyzing...' : 'Check Symptoms'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Important Notice
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  This symptom checker is powered by AI and is for informational purposes only. 
                  It is not a substitute for professional medical advice, diagnosis, or treatment.
                </p>
              </div>
              <div className="mt-5">
                <div className="rounded-md bg-yellow-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Emergency Warning
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          If you are experiencing a medical emergency, please call emergency services immediately.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker; 