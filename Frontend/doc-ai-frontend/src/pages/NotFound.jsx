import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NotFound = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-extrabold text-blue-600">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Page Not Found</h2>
          <p className="mt-2 text-sm text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          {user ? (
            <Link
              to={user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-base font-medium hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-base font-medium hover:bg-blue-700"
            >
              Go to Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound; 