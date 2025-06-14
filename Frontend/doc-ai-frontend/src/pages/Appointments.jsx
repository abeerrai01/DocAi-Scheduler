import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    doctorId: '',
    reason: '',
    symptoms: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const navigate = useNavigate();

  // Create axios instance with auth header
  const api = axios.create({
    baseURL: 'http://localhost:5001/api',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments');
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching available doctors...');
      
      // First, get all doctors
      const response = await api.get('/doctors');
      console.log('All doctors response:', response.data);
      
      // Then, get their availability status
      const doctorsWithAvailability = await Promise.all(
        response.data.map(async (doctor) => {
          try {
            const availabilityResponse = await api.get(`/doctors/${doctor._id}/availability`);
            return {
              ...doctor,
              isAvailable: availabilityResponse.data.isAvailable
            };
          } catch (error) {
            console.error(`Error fetching availability for doctor ${doctor._id}:`, error);
            return {
              ...doctor,
              isAvailable: false
            };
          }
        })
      );
      
      console.log('Doctors with availability:', doctorsWithAvailability);
      
      // Filter available doctors
      const availableDoctors = doctorsWithAvailability.filter(doctor => doctor.isAvailable);
      console.log('Available doctors:', availableDoctors);
      
      setDoctors(availableDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error.response?.data || error.message);
      setError('Failed to fetch available doctors. Please try again later.');
    } finally {
      setLoading(false);
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

  // Generate all possible time slots
  const allTimeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = Math.floor((i + 18) / 2);
    const minute = (i + 18) % 2 === 0 ? '00' : '30';
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute} ${period}`;
  });

  // Get available time slots for selected doctor and date
  const getAvailableTimeSlots = () => {
    if (!formData.doctorId || !formData.date) return [];
    
    const doctor = doctors.find(d => d.id === formData.doctorId);
    if (!doctor) return [];

    return doctor.availability[formData.date] || [];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset time when date or doctor changes
      ...(name === 'date' || name === 'doctorId' ? { time: '' } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !formData.date || !formData.time) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await api.post('/appointments', {
        doctorId: selectedDoctor,
        patientId: user._id,
        date: formData.date,
        time: formData.time,
        status: 'scheduled'
      });
      setSuccess('Appointment booked successfully!');
      // Reset form
      setFormData({
        date: '',
        time: '',
        doctorId: '',
        reason: '',
        symptoms: ''
      });
      setSelectedDoctor('');

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error booking appointment:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading appointments...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-600">{error}</div>
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
                            {user.role === 'doctor' 
                              ? `Patient: ${appointment.patient.name}`
                              : `Doctor: ${appointment.doctor.name}`}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500">
                            <span className="truncate">
                              Date: {new Date(appointment.date).toLocaleDateString()}
                            </span>
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500">
                            <span className="truncate">
                              Time: {new Date(appointment.date).toLocaleTimeString()}
                            </span>
                          </p>
                          {appointment.symptoms && (
                            <p className="mt-2 flex items-center text-sm text-gray-500">
                              <span className="truncate">
                                Symptoms: {appointment.symptoms.join(', ')}
                              </span>
                            </p>
                          )}
                          {appointment.isEmergency && (
                            <p className="mt-2 flex items-center text-sm text-red-600">
                              <span className="truncate">
                                Emergency Appointment
                              </span>
                            </p>
                          )}
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {user.role === 'doctor' && (
                            <select
                              value={appointment.status}
                              onChange={(e) => handleStatusUpdate(appointment._id, e.target.value)}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="completed">Completed</option>
                            </select>
                          )}
                          {user.role === 'patient' && (
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          )}
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
                {error && (
                  <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Preferred Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        name="date"
                        id="date"
                        required
                        min={today}
                        value={formData.date}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Doctor Selection */}
                  <div>
                    <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">
                      Select Doctor
                    </label>
                    <div className="mt-1">
                      <select
                        id="doctorId"
                        name="doctorId"
                        required
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="">Select a doctor</option>
                        {doctors.map((doctor) => (
                          <option key={doctor._id} value={doctor._id}>
                            Dr. {doctor.name} {doctor.specialization ? `- ${doctor.specialization}` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                      Available Time Slots
                    </label>
                    <div className="mt-1">
                      <select
                        id="time"
                        name="time"
                        required
                        value={formData.time}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled={!formData.doctorId || !formData.date}
                      >
                        <option value="">Select a time slot</option>
                        {getAvailableTimeSlots().map((time, index) => (
                          <option key={index} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      {formData.doctorId && formData.date && getAvailableTimeSlots().length === 0 && (
                        <p className="mt-2 text-sm text-red-600">
                          No available time slots for the selected date. Please choose another date.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Reason for Visit */}
                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                      Reason for Visit
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="reason"
                        id="reason"
                        required
                        value={formData.reason}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Brief description of your visit purpose"
                      />
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div>
                    <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
                      Symptoms (if any)
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="symptoms"
                        name="symptoms"
                        rows={3}
                        value={formData.symptoms}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Describe any symptoms you're experiencing"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? 'Booking...' : 'Book Appointment'}
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