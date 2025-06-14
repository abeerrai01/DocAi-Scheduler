import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// API configuration
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
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure pincode has a default value
        if (!parsedUser.pincode) {
          parsedUser.pincode = '000001';
        }
        setUser(parsedUser);
        localStorage.setItem('user', JSON.stringify(parsedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password, role) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting login with credentials:', { username, role });

      const loginData = { username, password, role };
      console.log('Sending login request with data:', loginData);

      const response = await api.post('/auth/login', loginData);
      console.log('Login response:', response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        setLoading(false);
        return { success: true, user: response.data.user };
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      
      if (error.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
        return { 
          success: false, 
          error: 'Request timed out. Please try again.' 
        };
      }
      
      if (!error.response) {
        setError('Unable to connect to the server. Please make sure the server is running at http://localhost:5001');
        return { 
          success: false, 
          error: 'Unable to connect to the server. Please make sure the server is running at http://localhost:5001' 
        };
      }
      
      if (error.response) {
        console.log('Error response:', error.response.data);
        
        // Handle role mismatch error
        if (error.response.status === 403 && error.response.data.actualRole) {
          const actualRole = error.response.data.actualRole;
          setError(`You are registered as a ${actualRole}. Please select the correct role.`);
          return { 
            success: false, 
            error: `You are registered as a ${actualRole}. Please select the correct role.`,
            actualRole 
          };
        }
        
        setError(error.response.data.message || 'Login failed. Please check your credentials and try again.');
        return { 
          success: false, 
          error: error.response.data.message || 'Login failed. Please check your credentials and try again.' 
        };
      }
      
      setError('An unexpected error occurred. Please try again.');
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    setUser,
    loading,
    error,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 