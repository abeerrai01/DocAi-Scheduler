import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AppointmentScheduler = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    symptoms: ''
  });

  // Mock doctors data - In a real app, this would come from an API
  const doctors = [
    { id: '1', name: 'Dr. Sarah Johnson', specialization: 'General Medicine' },
    { id: '2', name: 'Dr. Michael Chen', specialization: 'Cardiology' },
    { id: '3', name: 'Dr. Emily Brown', specialization: 'Pediatrics' }
  ];

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

    try {
      // TODO: Implement API call to schedule appointment
      console.log('Scheduling appointment:', formData);
      
      // Mock successful scheduling
      setTimeout(() => {
        navigate('/dashboard', { 
          state: { 
            message: 'Appointment scheduled successfully!' 
          }
        });
      }, 1000);
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      // TODO: Show error message to user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Schedule an Appointment
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">
                Select Doctor
              </label>
              <select
                id="doctorId"
                name="doctorId"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.doctorId}
                onChange={handleChange}
                required
              >
                <option value="">Select a doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Preferred Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Preferred Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Reason for Visit
              </label>
              <input
                type="text"
                id="reason"
                name="reason"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Brief description of your visit"
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
                Symptoms (if any)
              </label>
              <textarea
                id="symptoms"
                name="symptoms"
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe any symptoms you're experiencing"
                value={formData.symptoms}
                onChange={handleChange}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Scheduling...' : 'Schedule Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentScheduler; 