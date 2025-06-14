import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';
import { useNavigate } from 'react-router-dom';

const Appointments = () => {
  const { user, isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentType: 'regular',
    symptoms: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentReason, setAppointmentReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    const initializeData = async () => {
      try {
        await Promise.all([
          fetchDoctors(),
          fetchAppointments()
        ]);
      } catch (err) {
        console.error('Error initializing data:', err);
        setError('Failed to load initial data. Please refresh the page.');
      }
    };

    initializeData();
  }, [isAuthenticated, user, navigate]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/doctors');
      console.log('Raw doctors response:', response.data);

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format from server');
      }

      // Filter and map doctors
      const availableDoctors = response.data
        .filter(doctor => Boolean(doctor.isAvailable))
        .map(doctor => ({
          _id: doctor._id,  // Use _id instead of id
          name: doctor.name,
          specialization: doctor.specialization || 'General Medicine',
          isAvailable: Boolean(doctor.isAvailable)
        }));

      console.log('Processed doctors:', availableDoctors);
      setDoctors(availableDoctors);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to fetch doctors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await api.put(`/appointments/${appointmentId}`, { status: newStatus });
      fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error('Error updating appointment:', error);
      setError('Failed to update appointment status');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Form field changed:', { name, value });
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedTime || !appointmentReason) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const appointmentData = {
        doctorId: selectedDoctor,  // This will be the _id from the doctor object
        date: selectedDate,
        time: selectedTime,
        reason: appointmentReason
      };

      console.log('Booking appointment with data:', appointmentData);
      const response = await api.post('/appointments', appointmentData);
      console.log('Appointment booked successfully:', response.data);

      // Show success message and redirect
      alert('Appointment booked successfully!');
      navigate('/patient-dashboard');
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {user.role === 'doctor' ? 'View Appointments' : 'Book Appointment'}
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            {user.role === 'doctor' 
              ? 'View and manage your upcoming appointments'
              : 'Schedule your appointment with a doctor'}
          </p>
        </div>

        <div className="mt-12">
          {user.role === 'doctor' ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <li key={appointment._id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            Patient: {appointment.patientId?.name || 'Unknown'}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500">
                            <span className="truncate">
                              Date: {new Date(appointment.date).toLocaleDateString()}
                            </span>
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500">
                            <span className="truncate">
                              Time: {appointment.time}
                            </span>
                          </p>
                          {appointment.symptoms && (
                            <p className="mt-2 flex items-center text-sm text-gray-500">
                              <span className="truncate">
                                Symptoms: {appointment.symptoms}
                              </span>
                            </p>
                          )}
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <select
                            value={appointment.status}
                            onChange={(e) => handleStatusUpdate(appointment._id, e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="scheduled">Scheduled</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Book an Appointment</h2>

                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <form onSubmit={handleBookAppointment} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Select Doctor</label>
                    <select
                      value={selectedDoctor || ''}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      required
                    >
                      <option value="">Select a doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          Dr. {doctor.name} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      required
                    >
                      <option value="">Select a time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reason for Visit</label>
                    <textarea
                      value={appointmentReason}
                      onChange={(e) => setAppointmentReason(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {submitting ? 'Booking...' : 'Book Appointment'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;