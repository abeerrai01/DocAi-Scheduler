import React from 'react';
import { motion } from 'framer-motion';

const DeveloperCard = ({ name, description, linkedin, email }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
  >
    <div className="p-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
      </div>
      <p className="mt-4 text-gray-600">{description}</p>
      <div className="mt-4 flex space-x-4">
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          LinkedIn
        </a>
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          Gmail
        </a>
      </div>
    </div>
  </motion.div>
);

const AboutUs = () => {
  const developers = [
    {
      name: "Pushpendra Tripathi",
      description: "Designed and developed the user interface of DocAI Scheduler using React.js. Built an intuitive, user-friendly frontend that allows patients to easily input their symptoms, view doctor availability, and schedule appointments in just a few clicks. With seamless integration to backend APIs and machine learning predictions, ensured the user experience remains smooth, fast, and responsive across devices. Work involved handling authentication, dynamic form rendering, secure routing, and real-time updates — making complex health-tech tools feel simple and accessible.",
      linkedin: "https://www.linkedin.com/in/pushpendra-tripathi-b52aa4214/",
      email: "pushpendra.tri9@gmail.com"
    },
    {
      name: "Abeer Rai",
      description: "Built the backend system for DocAI Scheduler using Spring Boot and SQL, enabling smooth patient data storage and intelligent health predictions. The system accepts user inputs like name, age, pincode, and symptoms, stores them in a relational database, and seamlessly communicates with an ML model to return possible conditions based on symptoms. The project showcases ability to integrate real-time APIs, handle user authentication, connect with machine learning models, and build a scalable health-tech backend infrastructure.",
      linkedin: "https://www.linkedin.com/in/theabeerrai/",
      email: "theabeerrai@gmail.com"
    },
    {
      name: "Deepanshu Yadav",
      description: "Built and integrated the machine learning model responsible for symptom-based disease prediction. Designed a pipeline that analyzes patient symptoms and provides accurate medical insights, helping users understand their health better before visiting a doctor. Ensured the model was well-trained, optimized, and seamlessly connected to the backend API, allowing real-time predictions based on patient data. Contribution empowered the app with intelligent diagnosis capabilities, making it smarter, faster, and more reliable for everyday healthcare use.",
      linkedin: "https://www.linkedin.com/in/deepanshu-yadav-9a104321a",
      email: "dy229936@gmail.com"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            About DocAI
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            A revolutionary healthcare platform that combines artificial intelligence with medical expertise to provide accurate symptom analysis and treatment recommendations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {developers.map((developer, index) => (
            <DeveloperCard key={index} {...developer} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-16 bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600">
            At DocAI, we're committed to making healthcare more accessible and efficient through technology. 
            Our platform uses advanced AI algorithms to analyze symptoms and provide accurate treatment recommendations, 
            helping patients make informed decisions about their health.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 bg-primary-50 rounded-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'React.js',
              'Spring Boot',
              'TensorFlow',
              'MySQL',
              'Node.js',
              'Tailwind CSS',
              'Framer Motion',
              'REST APIs',
              'JWT Auth',
              'Git',
              'Vercel',
              'Render'
            ].map((tech) => (
              <div
                key={tech}
                className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <span className="text-gray-900 font-medium">{tech}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs; 
