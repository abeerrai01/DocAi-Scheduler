import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white shadow-lg mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-gray-500 text-sm">
            © 2025 DocAI. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link 
              to="/disclaimer" 
              className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
            >
              Disclaimer
            </Link>
            <Link 
              to="/about" 
              className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
            >
              About Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
