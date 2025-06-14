import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 second timeout
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure token is in the correct format
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      config.headers.Authorization = formattedToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user?.role === 'doctor') {
      fetchAvailability();
    }
  }, [user]);

  const fetchAvailability = async () => {
    try {
      console.log('Fetching doctor availability for:', user.id);
      const response = await api.get(`/doctors/${user.id}/availability`);
      console.log('Doctor availability response:', response.data);
      setIsAvailable(response.data.isAvailable);
    } catch (error) {
      console.error('Error fetching availability:', error.response?.data || error.message);
      setIsAvailable(false);
    }
  };

  const handleAvailabilityToggle = async () => {
    if (isLoading || !user?.id) return;
    
    setIsLoading(true);
    const newAvailability = !isAvailable;
    
    try {
      console.log('Toggling availability to:', newAvailability);
      // Optimistically update the UI
      setIsAvailable(newAvailability);
      
      const response = await api.put(`/doctors/${user.id}/availability`, {
        isAvailable: newAvailability
      });
      console.log('Toggle response:', response.data);
      
      // Update with the server response
      setIsAvailable(response.data.isAvailable);
    } catch (error) {
      console.error('Error updating availability:', error.response?.data || error.message);
      // Revert the optimistic update if the API call fails
      setIsAvailable(!newAvailability);
    } finally {
      setIsLoading(false);
    }
  };

  const getNavItems = () => {
    if (!user) {
      return [
        { name: 'Home', path: '/' }
      ];
    }

    if (user.role === 'doctor') {
      return [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Appointments', path: '/doctor/appointments' },
        { name: 'Profile', path: '/profile' }
      ];
    }

    return [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Book Appointment', path: '/appointments' },
      { name: 'Symptom Checker', path: '/symptom-checker' },
      { name: 'Profile', path: '/profile' }
    ];
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavLinks = () => (
    <>
      {getNavItems().map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => setIsMobileMenuOpen(false)}
          className={`${
            location.pathname === item.path
              ? 'border-indigo-500 text-gray-900'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
          } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
        >
          {item.name}
        </Link>
      ))}
    </>
  );

  const UserMenu = () => (
    <div className="flex items-center space-x-4">
      {user?.role === 'doctor' && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Available</span>
          <button
            onClick={handleAvailabilityToggle}
            disabled={isLoading}
            className={`${
              isAvailable ? 'bg-green-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span
              className={`${
                isAvailable ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </button>
          {isLoading && (
            <span className="text-xs text-gray-500">Updating...</span>
          )}
        </div>
      )}
      <div className="flex items-center space-x-2">
        <div className="text-sm">
          <span className="font-medium text-gray-900">{user?.name || user?.username}</span>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
            user?.role === 'doctor' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {user?.role === 'doctor' ? 'Doctor' : 'Patient'}
          </span>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Logout
      </button>
    </div>
  );

  const GuestMenu = () => (
    <div className="flex items-center space-x-4">
      <Link
        to="/login"
        onClick={() => setIsMobileMenuOpen(false)}
        className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
      >
        Login
      </Link>
      <Link
        to="/register"
        onClick={() => setIsMobileMenuOpen(false)}
        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Register
      </Link>
    </div>
  );

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600">
                DocAI
              </Link>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLinks />
            </div>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? <UserMenu /> : <GuestMenu />}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <NavLinks />
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-4">
            {user ? <UserMenu /> : <GuestMenu />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 