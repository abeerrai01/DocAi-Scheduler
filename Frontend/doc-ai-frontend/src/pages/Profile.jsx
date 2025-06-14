import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 second timeout
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure token is in the correct format
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      config.headers.Authorization = formattedToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    pincode: '',
    age: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      console.log('Setting initial form data:', user);
      setFormData({
        username: user.username || '',
        name: user.name || '',
        pincode: user.pincode || '000001',
        age: user.age || '20' // Default to '20' if no age
      });
    }
  }, [user]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Full Name is required';
    }
    if (!formData.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = 'Pincode must be 6 digits';
    }
    if (!formData.age) {
      errors.age = 'Age is required';
    } else {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 0 || age > 120) {
        errors.age = 'Age must be between 0 and 120';
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      console.log('Submitting profile update:', formData);
      
      const response = await api.put('/users/profile', {
        name: formData.name,
        pincode: formData.pincode
      });

      console.log('Profile update response:', response.data);

      // Update the user context with new data
      if (response.data.user) {
        setUser(prevUser => ({
          ...prevUser,
          ...response.data.user
        }));
      }

      setMessage({
        type: 'success',
        text: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Profile update error:', error);
      let errorMessage = 'Failed to update profile';
      
      if (error.response) {
        console.error('Error response:', error.response.data);
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        console.error('No response received:', error.request);
        errorMessage = 'No response from server. Please try again.';
      } else {
        console.error('Error setting up request:', error.message);
        errorMessage = error.message;
      }

      setMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>

          {message.text && (
            <div
              className={`mb-4 p-4 rounded ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  disabled
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    validationErrors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                Pincode
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="pincode"
                  id="pincode"
                  maxLength="6"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    validationErrors.pincode ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter 6-digit pincode"
                />
                {validationErrors.pincode && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.pincode}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="age"
                  id="age"
                  min="0"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    validationErrors.age ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter your age"
                />
                {validationErrors.age && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.age}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile; 