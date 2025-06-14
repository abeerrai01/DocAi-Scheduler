import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch upcoming appointments from API
    // Mock data for now
    const mockAppointments = [
      {
        id: 1,
        doctorName: 'Dr. Sarah Johnson',
        date: '2024-03-20',
        time: '10:00 AM',
        reason: 'Regular checkup'
      },
      {
        id: 2,
        doctorName: 'Dr. Michael Chen',
        date: '2024-03-25',
        time: '2:30 PM',
        reason: 'Follow-up consultation'
      }
    ];

    setUpcomingAppointments(mockAppointments);
    setLoading(false);
  }, []);

  const handleFeatureClick = (feature) => {
    switch (feature) {
      case 'symptom-checker':
        navigate('/symptom-checker');
        break;
      case 'appointments':
        navigate('/appointment-scheduler');
        break;
      case 'profile':
        navigate('/profile');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Message */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {currentUser?.displayName || 'User'}!
          </h1>
          {location.state?.message && (
            <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
              {location.state.message}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <button
            onClick={() => handleFeatureClick('symptom-checker')}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Symptom Checker</h3>
              <p className="mt-2 text-sm text-gray-500">
                Get AI-powered health insights based on your symptoms
              </p>
            </div>
          </button>

          <button
            onClick={() => handleFeatureClick('appointments')}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Schedule Appointment</h3>
              <p className="mt-2 text-sm text-gray-500">
                Book an appointment with our healthcare providers
              </p>
            </div>
          </button>

          <button
            onClick={() => handleFeatureClick('profile')}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">View Profile</h3>
              <p className="mt-2 text-sm text-gray-500">
                Manage your personal information and medical history
              </p>
            </div>
          </button>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Upcoming Appointments</h2>
          </div>
          <div className="border-t border-gray-200">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading appointments...</div>
            ) : upcomingAppointments.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {upcomingAppointments.map((appointment) => (
                  <li key={appointment.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.doctorName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appointment.date} at {appointment.time}
                        </p>
                        <p className="text-sm text-gray-500">{appointment.reason}</p>
                      </div>
                      <button
                        onClick={() => navigate(`/appointment-scheduler?edit=${appointment.id}`)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Reschedule
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No upcoming appointments
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 