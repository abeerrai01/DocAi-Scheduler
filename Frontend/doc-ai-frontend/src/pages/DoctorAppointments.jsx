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
      console.log('Fetching appointments for doctor:', user._id);
      const response = await api.get(`/doctors/${user._id}/appointments`);
      console.log('Appointments response:', response.data);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      console.log('Updating appointment status:', { appointmentId, newStatus });
      await api.put(`/appointments/${appointmentId}`, {
        status: newStatus
      });
      console.log('Status updated successfully');
      fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error('Error updating appointment:', error);
      setError('Failed to update appointment status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

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
              <p className="text-sm text-gray-600">
                <span className="font-medium">Patient Email:</span>{' '}
                {appointment.patientId?.email || 'N/A'}
              </p>
              {appointment.symptoms && appointment.symptoms.length > 0 && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Symptoms:</span>{' '}
                  {appointment.symptoms.join(', ')}
                </p>
              )}
              <p className="text-sm text-gray-600">
                <span className="font-medium">Type:</span>{' '}
                {appointment.isEmergency ? 'Emergency' : 'Regular Checkup'}
              </p>
            </div>

            <div className="flex space-x-2">
              {appointment.status === 'scheduled' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                    className="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Mark Complete
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                    className="flex-1 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Cancel
                  </button>
                </>
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