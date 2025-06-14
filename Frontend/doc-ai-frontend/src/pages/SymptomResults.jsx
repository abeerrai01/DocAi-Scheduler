import { useLocation, useNavigate } from 'react-router-dom';

const SymptomResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysis, symptoms } = location.state || {};

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              No Results Found
            </h1>
            <p className="mt-3 text-xl text-gray-500">
              Please check your symptoms again
            </p>
            <div className="mt-8">
              <button
                onClick={() => navigate('/symptom-checker')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Check Symptoms Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Symptom Analysis Results
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Based on your reported symptoms
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {/* Reported Symptoms */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Reported Symptoms</h2>
              <div className="mt-4 space-y-4">
                {symptoms.selected && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Selected Symptoms:</h3>
                    <p className="mt-1 text-sm text-gray-600">{symptoms.selected}</p>
                  </div>
                )}
                {symptoms.additional && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Additional Symptoms:</h3>
                    <p className="mt-1 text-sm text-gray-600">{symptoms.additional}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Possible Conditions */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Possible Conditions</h2>
              <ul className="mt-4 space-y-2">
                {analysis.possibleConditions.map((condition, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    • {condition}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Severity Level */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Severity Level</h2>
              <div className="mt-4">
                <span className={`text-lg font-semibold ${getSeverityColor(analysis.severity)}`}>
                  {analysis.severity}
                </span>
                {analysis.severity.toLowerCase() === 'high' && (
                  <p className="mt-2 text-sm text-red-600">
                    Please seek medical attention immediately.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Recommendations</h2>
              <ul className="mt-4 space-y-2">
                {analysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    • {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/symptom-checker')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Check Symptoms Again
            </button>
            <button
              onClick={() => navigate('/appointments')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Book an Appointment
            </button>
          </div>

          {/* Important Notice */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Important Notice
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        This analysis is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
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
  );
};

export default SymptomResults; 