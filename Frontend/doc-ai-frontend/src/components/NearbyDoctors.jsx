import React, { useState, useEffect } from 'react';
import api from '../config/api';
import { toast } from 'react-toastify';

const NearbyDoctors = ({ onSelectDoctor }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const fetchNearbyDoctors = async () => {
    try {
      setLoading(true);
      setError('');

      const location = await getCurrentLocation();
      const response = await api.get('/doctors/nearby', {
        params: {
          latitude: location.latitude,
          longitude: location.longitude
        }
      });

      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching nearby doctors:', error);
      setError('Failed to fetch nearby doctors. Please try again.');
      toast.error('Failed to fetch nearby doctors');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Copied to clipboard!'))
      .catch(() => toast.error('Failed to copy to clipboard'));
  };

  useEffect(() => {
    fetchNearbyDoctors();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Nearby Doctors</h2>
      {doctors.length === 0 ? (
        <p className="text-gray-500">No doctors found nearby</p>
      ) : (
        <div className="grid gap-4">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Dr. {doctor.name}
                  </h3>
                  <p className="text-sm text-gray-500">{doctor.specialization}</p>
                </div>
                <button
                  onClick={() => onSelectDoctor(doctor)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Book Now
                </button>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm text-gray-600">Username:</span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {doctor.username}
                </code>
                <button
                  onClick={() => copyToClipboard(doctor.username)}
                  className="text-indigo-600 hover:text-indigo-800"
                  title="Copy username"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={fetchNearbyDoctors}
        className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        Refresh List
      </button>
    </div>
  );
};

export default NearbyDoctors; 
