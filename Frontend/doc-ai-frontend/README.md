# DocAI Scheduler

A comprehensive medical appointment scheduling system with features for both doctors and patients.

## Features

### For Patients
- Book appointments with available doctors
- View past appointments and their status
- Access detailed doctor information including address
- Symptom checker for preliminary health assessment
- View appointment history with status tracking

### For Doctors
- Manage availability status
- View and manage appointments
- Set up schedule and working hours
- View patient details and appointment history

## Tech Stack

- Frontend: React.js with Tailwind CSS
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/docai-scheduler.git
cd docai-scheduler
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../src
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. In a new terminal, start the frontend:
```bash
cd src
npm start
```

The application will be available at:
- Frontend: - https://doc-ai-scheduler.vercel.app
- Backend API: https://docai-frontend-backend-production.up.railway.app

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get user profile

### Appointments
- GET /api/appointments - Get all appointments
- POST /api/appointments - Create new appointment
- GET /api/appointments/:id - Get appointment details
- PUT /api/appointments/:id - Update appointment
- DELETE /api/appointments/:id - Cancel appointment

### Doctors
- GET /api/doctors - Get all available doctors
- GET /api/doctors/:id - Get doctor details
- PUT /api/doctors/:id/availability - Update doctor availability

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@docai-scheduler.com or open an issue in the repository.
