# 🧠 DocAi Scheduler

DocAi Scheduler is a full-stack AI-powered healthcare assistant web app that:

- Predicts patient risk level using ML 🧪
- Manages appointments with doctors 📅
- Supports emergency and regular checkups 🚑
- Uses Spring Boot, Flask, Node.js, and React 🔥

---

## 📁 Project Structure

DocAi-Scheduler/
├── ML model/ # Flask ML backend (port 5000)
├── backend/ # Spring Boot backend (port 8080)
├── Frontend/
│ └── doc-ai-frontend/
│ ├── backend/ # Express.js alternate backend (port 5001)
│ └── [React App] # Frontend (port 5173)
└── start.sh # Script to launch all services

yaml
Copy
Edit

---

## 🚀 Running the Project with `start.sh`

### ✅ Prerequisites

Make sure the following are installed:

- Python 3.8+
- Java 17+ (for Spring Boot)
- Node.js 18+ and npm
- Bash (for Mac or Git Bash on Windows)
- pip (Python package installer)

---

### 💻 Windows Instructions (Using Git Bash)

1. Open **Git Bash** in your project directory.
2. Run:

   ```bash
   ./start.sh
Make sure you’re inside the root of the DocAi-Scheduler directory before running.

🍏 macOS/Linux Instructions
Open Terminal.

Make the script executable (only once):

bash
Copy
Edit
chmod +x start.sh
Run it:

bash
Copy
Edit
./start.sh
🌐 Ports Used
Service	Description	Port	URL
🧠 ML Model (Flask)	Predicts risk from symptoms	5000	http://localhost:5000
⚙️ Spring Boot Backend	Manages patient records	8080	http://localhost:8080
🧾 Alternate Backend	Express.js for appointments	5001	http://localhost:5001
🌐 React Frontend	Main user interface	5173	http://localhost:5173

🛠️ Built With
React.js – Frontend UI

Spring Boot – Java backend for data storage

Flask + scikit-learn – ML Model backend

Express.js – Node.js for appointment management

MongoDB/MySQL – Database integration

Tailwind CSS – Styling

🤖 ML Functionality
Uses TfidfVectorizer + RandomForestClassifier

Predicts risk level: LOW / MEDIUM / HIGH

Recommends treatment plans based on symptoms

💬 Author
Made with 💙 by Abeer Rai
Feel free to drop a ⭐ on GitHub
