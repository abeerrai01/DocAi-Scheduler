import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';

const DoctorAppointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'doctor') {
      navigate('/dashboard');
      return;
    }
    fetchAppointments();
  }, [user, navigate]);

  const fetchAppointments = async () => {
    try {
      const response = await api.get(`/doctors/${user._id}/appointments`);
      console.log('Fetched appointments:', response.data);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const formatSymptoms = (symptoms) => {
    if (!symptoms) return '';
    if (Array.isArray(symptoms)) return symptoms.join(', ');
    if (typeof symptoms === 'string') return symptoms;
    return '';
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Appointments</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {appointments.map((appointment) => (
          <div
            key={appointment._id}
            className="bg-white rounded-lg shadow-md p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {appointment.patientId?.name || 'Unknown Patient'}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(appointment.date).toLocaleDateString()} at{' '}
                  {appointment.time}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  appointment.status === 'scheduled'
                    ? 'bg-yellow-100 text-yellow-800'
                    : appointment.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {appointment.status}
              </span>
            </div>

            <div className="space-y-2">
              {appointment.symptoms && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Symptoms:</span>{' '}
                  {formatSymptoms(appointment.symptoms)}
                </p>
              )}
              <p className="text-sm text-gray-600">
                <span className="font-medium">Type:</span>{' '}
                {appointment.reason === 'emergency' ? 'Emergency' : 'Regular Checkup'}
              </p>
            </div>

            <div className="flex space-x-2">
              {appointment.status === 'scheduled' && (
                <span className="text-sm text-gray-500">
                  Appointment is scheduled
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {appointments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No appointments found</p>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments; 
