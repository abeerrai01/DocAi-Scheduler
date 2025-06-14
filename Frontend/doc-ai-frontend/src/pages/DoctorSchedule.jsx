import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';

const DoctorSchedule = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await api.get('/doctors/schedule');
      setSchedule(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setError('Failed to fetch schedule');
      setLoading(false);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      await api.post('/doctors/schedule', {
        date: selectedDate,
        time: selectedTime,
        duration
      });
      fetchSchedule();
      setSelectedDate('');
      setSelectedTime('');
      setDuration(30);
    } catch (error) {
      console.error('Error adding slot:', error);
      setError('Failed to add time slot');
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      await api.delete(`/doctors/schedule/${slotId}`);
      fetchSchedule();
    } catch (error) {
      console.error('Error deleting slot:', error);
      setError('Failed to delete time slot');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading schedule...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Manage Your Schedule
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Add and manage your available time slots
          </p>
        </div>

        <div className="mt-12">
          <form onSubmit={handleAddSlot} className="space-y-4 bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duration (minutes)
                </label>
                <select
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Time Slot
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 text-center text-red-600">
              {error}
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900">Your Schedule</h3>
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
              {schedule.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No time slots added yet
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {schedule.map((slot) => (
                    <li key={slot._id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {new Date(slot.date).toLocaleDateString()}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500">
                            <span className="truncate">
                              Time: {new Date(slot.time).toLocaleTimeString()}
                            </span>
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500">
                            <span className="truncate">
                              Duration: {slot.duration} minutes
                            </span>
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <button
                            onClick={() => handleDeleteSlot(slot._id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule; 