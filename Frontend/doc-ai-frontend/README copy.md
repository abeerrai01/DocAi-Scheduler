# DocAI Scheduler Frontend

A modern web application for AI-powered medical appointment scheduling.

## Features

- AI-powered risk assessment based on symptoms
- Smart appointment scheduling
- Doctor and patient portals
- Real-time updates and notifications
- Responsive design

## Tech Stack

- React.js
- Material-UI
- Axios for API calls
- Framer Motion for animations
- Tailwind CSS for styling
- React Router for navigation

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd docai-scheduler-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add:
   ```
   REACT_APP_API_URL=https://docai-frontend-backend-production.up.railway.app
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `- https://doc-ai-scheduler.vercel.app`

## Project Structure

```
src/
├── components/         # Reusable components
├── pages/             # Page components
├── services/          # API services
├── utils/             # Utility functions
└── styles/            # Global styles
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## API Integration

The frontend integrates with the following backend endpoints:

- `/api/predict` - Risk assessment
- `/api/appointments` - Appointment management
- `/api/doctors` - Doctor information

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 