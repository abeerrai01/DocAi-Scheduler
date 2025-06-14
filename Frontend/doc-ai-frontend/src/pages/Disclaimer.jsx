import { Link } from 'react-router-dom';

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Disclaimer</h1>
            <Link 
              to="/" 
              className="text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
          
          <div className="space-y-6 text-gray-600">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Important Notice:</strong> This application uses artificial intelligence for symptom analysis and scheduling. Please consult with healthcare professionals for medical advice.
                  </p>
                </div>
              </div>
            </div>

            <p>
              DocAI is an AI-powered healthcare scheduling platform designed to assist in appointment management and preliminary symptom analysis. However, it is important to understand the following:
            </p>

            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Not a Medical Diagnosis Tool:</strong> The symptom checker and any AI-generated suggestions are for informational purposes only and should not be considered as medical advice.
              </li>
              <li>
                <strong>Professional Consultation Required:</strong> Always consult with qualified healthcare professionals for proper medical diagnosis and treatment.
              </li>
              <li>
                <strong>Emergency Situations:</strong> In case of medical emergencies, please contact emergency services immediately or visit the nearest emergency room.
              </li>
              <li>
                <strong>Accuracy Limitations:</strong> While we strive for accuracy, AI systems may not always provide perfect results. Use your judgment and seek professional advice.
              </li>
            </ul>

            <p className="mt-6">
              By using DocAI, you acknowledge that you understand these limitations and agree to use the platform as a supplementary tool rather than a replacement for professional medical care.
            </p>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer; 