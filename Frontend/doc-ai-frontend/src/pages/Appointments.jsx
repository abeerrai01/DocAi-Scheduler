import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';
import { useNavigate } from 'react-router-dom';
import NearbyDoctors from '../components/NearbyDoctors';

const Appointments = () => {
  const { user, isAuthenticated } = useAuth();
  const role = user?.role;
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentReason, setAppointmentReason] = useState('regular');
  const [contact, setContact] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    const initializeData = async () => {
      try {
        await Promise.all([fetchNearbyDoctors(), fetchAppointments()]);
      } catch (err) {
        setError('Failed to load initial data. Please refresh the page.');
      }
    };

    initializeData();
  }, [isAuthenticated, user, navigate]);

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
            longitude: position.coords.longitude,
          });
        },
        (error) => reject(error)
      );
    });
  };

  const fetchNearbyDoctors = async () => {
    try {
      setLoading(true);
      const location = await getCurrentLocation();
      const response = await api.get('/doctors/nearby', {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          maxDistance: 50000,
        },
      });

      const availableDoctors = response.data
        .filter((doctor) => Boolean(doctor.isAvailable))
        .map((doctor) => ({
          _id: doctor._id,
          name: doctor.name,
          specialization: doctor.specialization || 'General Medicine',
          isAvailable: Boolean(doctor.isAvailable),
          location: doctor.location,
        }));

      setDoctors(availableDoctors);
    } catch (err) {
      console.error('Error fetching nearby doctors:', err);
      setError('Failed to fetch nearby doctors. Please try again later.');
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

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor._id);
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedTime || !appointmentReason || !contact) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const appointmentData = {
        doctorId: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        reason: appointmentReason,
        contact: contact,
        specialization: role === 'doctor' ? user?.specialization : undefined,
        location: role === 'doctor' ? user?.location : undefined,
      };

      const response = await api.post('/appointments', appointmentData);

      setSuccess('Appointment booked successfully!');
      setContact('');
      setSelectedDate('');
      setSelectedTime('');
      setAppointmentReason('regular');
      fetchAppointments();
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-12">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Book New Appointment</h2>

          <div className="mb-8">
            <NearbyDoctors onSelectDoctor={handleDoctorSelect} />
          </div>

          <form onSubmit={handleBookAppointment} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Doctor</label>
              <select
                value={selectedDoctor || ''}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="regular"
                    name="appointmentType"
                    value="regular"
                    checked={appointmentReason === 'regular'}
                    onChange={(e) => setAppointmentReason(e.target.value)}
                    className="h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label htmlFor="regular" className="ml-3 block text-sm text-gray-700">
                    Regular Check-up
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="emergency"
                    name="appointmentType"
                    value="emergency"
                    checked={appointmentReason === 'emergency'}
                    onChange={(e) => setAppointmentReason(e.target.value)}
                    className="h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label htmlFor="emergency" className="ml-3 block text-sm text-gray-700">
                    Emergency
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email or Phone</label>
              <input
                type="text"
                name="contact"
                placeholder="Enter email or phone number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">{error}</div>
            )}
            {success && (
              <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">{success}</div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Appointments</h2>
          {appointments.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <li key={appointment._id} className="py-4">
                  <p className="text-sm font-medium text-indigo-600">Doctor: Dr. {appointment.doctorId?.name}</p>
                  <p className="text-sm text-gray-500">Date: {new Date(appointment.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">Time: {appointment.time}</p>
                  <p className="text-sm text-gray-500">Reason: {appointment.reason}</p>
                  <p className="text-sm text-gray-500">Status: {appointment.status}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No appointments found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
