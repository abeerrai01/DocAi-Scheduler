import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DoctorDashboard = () => {
  const { user } = useAuth();

  const features = [
    {
      title: 'Manage Appointments',
      description: 'View and manage your upcoming appointments',
      icon: '📅',
      path: '/doctor/appointments'
    },
    {
      title: 'View Profile',
      description: 'View and update your professional profile',
      icon: '👤',
      path: '/profile'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Welcome, Dr. {user?.name || 'Doctor'}
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Your medical practice management dashboard
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Link
                key={feature.title}
                to={feature.path}
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white text-2xl">
                    {feature.icon}
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {feature.description}
                  </p>
                </div>
                <span
                  className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                  aria-hidden="true"
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard; 