import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      title: 'AI-Powered Symptom Checker',
      description: 'Get instant insights about your symptoms and potential conditions.',
      icon: '🔍',
      link: '/symptom-checker'
    },
    {
      title: 'Smart Appointment Booking',
      description: 'Book appointments with doctors based on your symptoms and urgency.',
      icon: '📅',
      link: '/appointments'
    },
    {
      title: 'Emergency Care',
      description: 'Quick access to emergency care when you need it most.',
      icon: '🚑',
      link: '/symptom-checker'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center">
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
          >
            <span className="block">Welcome to</span>
            <span className="block text-blue-600">DocAI Healthcare</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
          >
            Your AI-powered healthcare companion. Get instant medical insights and connect with healthcare professionals.
          </motion.p>
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8"
            >
              <div className="rounded-md shadow">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="relative group bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-base text-gray-500">{feature.description}</p>
              <Link
                to={feature.link}
                className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                Learn more
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-blue-600 py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">98%</div>
              <div className="mt-2 text-blue-100">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">24/7</div>
              <div className="mt-2 text-blue-100">Available Support</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">:)</div>
              <div className="mt-2 text-blue-100">Happy Patients</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home; 