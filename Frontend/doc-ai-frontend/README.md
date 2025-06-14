# DocAi-Scheduler

A modern web application for AI-powered medical appointment scheduling and symptom checking. This project includes both a frontend (React + Vite) and a backend (Node.js + Express + MongoDB).

## Features
- **User Authentication**: Register and login as a patient or doctor
- **Role-based Dashboards**: Separate portals for patients and doctors
- **Symptom Checker**: AI-powered symptom analysis and emergency detection
- **Doctor Availability**: Doctors can toggle their availability
- **Appointment Booking**: Patients can book appointments with available doctors
- **Profile Management**: Update pincode and view profile details
- **Secure API**: JWT-based authentication and protected routes
- **Responsive UI**: Modern, mobile-friendly design

## Folder Structure
```
/DocAi-Scheduler
├── backend/           # Node.js/Express backend
├── src/               # React frontend source code
├── public/            # Static assets
├── package.json       # Project metadata and scripts
├── README.md          # Project documentation
└── ...
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm
- MongoDB Atlas account (or local MongoDB)

### Backend Setup
1. `cd backend`
2. Copy `.env.example` to `.env` and fill in your MongoDB URI and JWT secret
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Go to the project root:
   ```sh
   cd ..
   ```
2. Install frontend dependencies:
   ```sh
   npm install
   ```
3. Start the frontend:
   ```sh
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Usage
- Register as a patient or doctor
- Doctors can set their availability and view appointments
- Patients can check symptoms, book appointments, and manage their profile
- Admin features can be added as needed

## API Endpoints
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login
- `GET /api/doctors` — List available doctors
- `PUT /api/doctors/:doctorId/availability` — Toggle doctor availability
- `POST /api/appointments` — Book an appointment
- `PUT /api/users/profile` — Update user profile

## Contributing
1. Fork this repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to your branch (`git push origin feature/your-feature`)
5. Create a Pull Request

## License
This project is licensed under the MIT License.

---

**Disclaimer:** This project is for educational purposes only. The AI symptom checker is not a substitute for professional medical advice. Always consult a qualified healthcare provider for medical concerns.

## Running the Project After Cloning

### 1. Clone the Repository
If you haven't already, clone the repository:
```sh
git clone https://github.com/pushpendra-9/doc-ai-frontend.git
cd doc-ai-frontend
```

### 2. Install Dependencies
Install the required dependencies for both the frontend and backend:

#### Frontend
```sh
npm install
```

#### Backend
```sh
cd backend
npm install
```

### 3. Set Up Environment Variables
- Copy the `.env.example` file in the `backend` directory to a new file named `.env`.
- Fill in your MongoDB URI and JWT secret in the `.env` file.

### 4. Start the Backend Server
In the `backend` directory, run:
```sh
npm start
```

### 5. Start the Frontend
Go back to the project root and start the frontend:
```sh
cd ..
npm run dev
```

### 6. Access the Application
Open your browser and go to [http://localhost:5173](http://localhost:5173) to see the application running.

### Summary
- **Clone** the repository.
- **Install dependencies** for both frontend and backend.
- **Set up environment variables** for the backend.
- **Start the backend server** and **frontend**.
- **Access the application** in your browser.

If you encounter any issues or need further assistance, feel free to ask!
