import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    if (user && user.role === 'doctor') {
      fetchAvailability();
    }
  }, [user]);

  const fetchAvailability = async () => {
    try {
      const response = await api.get(`/doctors/${user.id}/availability`);
      setIsAvailable(response.data.isAvailable);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const handleAvailabilityToggle = async () => {
    try {
      const response = await api.put(`/doctors/${user.id}/availability`, {
        isAvailable: !isAvailable
      });
      setIsAvailable(response.data.isAvailable);
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getNavLinkClass = (path) => {
    return `text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
      isActive(path) ? 'bg-gray-900 text-white' : ''
    }`;
  };

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-white font-bold text-xl">
                DocAI Scheduler
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {user ? (
                  <>
                    <Link to="/dashboard" className={getNavLinkClass('/dashboard')}>
                      Dashboard
                    </Link>
                    {user.role === 'doctor' ? (
                      <Link to="/doctor/appointments" className={getNavLinkClass('/doctor/appointments')}>
                        Appointments
                      </Link>
                    ) : (
                      <>
                        <Link to="/appointments" className={getNavLinkClass('/appointments')}>
                          Appointments
                        </Link>
                        <Link to="/symptom-checker" className={getNavLinkClass('/symptom-checker')}>
                          Symptom Checker
                        </Link>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Link to="/" className={getNavLinkClass('/')}>
                      Home
                    </Link>
                    <Link to="/login" className={getNavLinkClass('/login')}>
                      Login
                    </Link>
                    <Link to="/register" className={getNavLinkClass('/register')}>
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user && (
                <div className="flex items-center space-x-4">
                  {user.role === 'doctor' && (
                    <button
                      onClick={handleAvailabilityToggle}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                        isAvailable
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {isAvailable ? 'Available' : 'Unavailable'}
                    </button>
                  )}
                  <span className="text-gray-300 text-sm">
                    Welcome, {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
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
              ) : (
                <svg
                  className="block h-6 w-6"
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
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/dashboard')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                {user.role === 'doctor' ? (
                  <Link
                    to="/doctor/appointments"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/doctor/appointments')
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    Appointments
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/appointments"
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        isActive('/appointments')
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      Appointments
                    </Link>
                    <Link
                      to="/symptom-checker"
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        isActive('/symptom-checker')
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      Symptom Checker
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/login')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/register')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
          {user && (
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-500 flex items-center justify-center">
                    <span className="text-white text-lg font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">
                    {user.name}
                  </div>
                  <div className="text-sm font-medium leading-none text-gray-400">
                    {user.role}
                  </div>
                </div>
              </div>
              {user.role === 'doctor' && (
                <div className="mt-3 px-2">
                  <button
                    onClick={handleAvailabilityToggle}
                    className={`w-full px-3 py-2 rounded-md text-base font-medium ${
                      isAvailable
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {isAvailable ? 'Available' : 'Unavailable'}
                  </button>
                </div>
              )}
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;