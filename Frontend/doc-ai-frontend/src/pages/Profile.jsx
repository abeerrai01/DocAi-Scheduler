import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    age: '20',
    pincode: '000000'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        name: user.name || user.username || '',
        age: user.age?.toString() || '20',
        pincode: user.pincode || '000000'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Ensure all fields have values
      const updateData = {
        name: formData.name || formData.username,
        age: formData.age || '20',
        pincode: formData.pincode || '000000'
      };

      // Validate age
      const ageNum = Number(updateData.age);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
        setError('Age must be between 0 and 120');
        setLoading(false);
        return;
      }

      // Validate pincode
      if (!/^\d{6}$/.test(updateData.pincode)) {
        setError('Pincode must be 6 digits');
        setLoading(false);
        return;
      }

      console.log('Sending profile update request:', updateData);

      const response = await api.put('/api/profile', updateData);
      console.log('Profile update response:', response.data);

      if (response.data.user) {
        const updatedUser = {
          ...user,
          ...response.data.user
        };
        updateUser(updatedUser);
        setSuccess('Profile updated successfully');
        setFormData(prev => ({
          ...prev,
          name: response.data.user.name,
          age: response.data.user.age?.toString() || '20',
          pincode: response.data.user.pincode || '000000'
        }));
      }
    } catch (err) {
      console.error('Profile update error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      console.log('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="0"
            max="120"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Pincode</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
            pattern="\d{6}"
            maxLength="6"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile; 