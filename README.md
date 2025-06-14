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
🛠️ Setting Up Spring Boot with Railway MySQL
Your Spring Boot backend is configured to connect to a Railway-hosted MySQL database using the application.properties file.

Here's the sample config used:

properties
Copy
Edit
# application.properties

spring.application.name=Backend
spring.datasource.url=jdbc:mysql://centerbeam.proxy.rlwy.net:24095/railway
spring.datasource.username=root
spring.datasource.password=SnZgpgkVyPNWPIDuFRotlDIxRaUBluyJ
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
⚠️ For New Users (Important):
If you're cloning this project or deploying it yourself, you must replace these values with your own from Railway.

🔐 Steps to Get Your Railway DB Credentials:
Go to https://railway.app

Open your Spring Boot backend project

Click on the MySQL plugin

Copy the following values:

Database URL → Replace in spring.datasource.url

Username → Replace in spring.datasource.username

Password → Replace in spring.datasource.password

Also note your Port (e.g. 24095)

✅ Example After Your Changes:
If your Railway DB info is like:

Host: aws-123456.railway.internal

Port: 12345

DB Name: my_db

Username: root

Password: my_secure_pass

Then update as:

properties
Copy
Edit
spring.datasource.url=jdbc:mysql://aws-123456.railway.internal:12345/my_db
spring.datasource.username=root
spring.datasource.password=my_secure_pass
💡 Tips:
Make sure your port is correct

Railway usually assigns non-standard ports (not 3306)

Keep .properties file secure if you're pushing code to GitHub


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
