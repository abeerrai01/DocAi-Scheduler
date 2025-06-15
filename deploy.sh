#!/bin/bash

echo "🚀 Deploying DocAi Scheduler..."

# --- Start ML Model (Port 5050) ---
echo "🧠 Starting ML Model on port 5050..."
cd "ML model" || { echo "❌ ML model directory not found"; exit 1; }

# Activate virtual environment
if [ ! -d "venv" ]; then
  echo "📦 Creating virtual environment..."
  python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate
echo "📦 Installing/Updating requirements..."
python3 -m pip install --upgrade pip
python3 -m pip install -r Requirement.txt

# Start the ML model
python3 model.py &

cd ..
# --- Start Spring Boot Backend (Port 8080) ---
echo "⚙️ Starting Spring Boot Backend on port 8080..."
cd "backend" || { echo "❌ Spring Boot backend not found"; exit 1; }
./mvnw spring-boot:run &  # or use mvn spring-boot:run if not using wrapper
cd ..

# --- Start Backend (Port 5001) ---
echo "🧾 Starting Backend on port 5001..."
cd "D:\Pishpendra\Doc-Ai\Frontend\doc-ai-frontend\backend" || { echo "❌ Backend not found"; exit 1; }
npm install
npm start &

# --- Start Frontend (Port 5173) ---
echo "🌐 Starting Frontend on port 5173..."
cd "D:\Pishpendra\Doc-Ai\Frontend\doc-ai-frontend" || { echo "❌ Frontend not found"; exit 1; }
npm install
npm run dev &

echo ""
echo "✅ All services started. Ports in use:"
echo " - ML Model:  http://localhost:5050"
echo " - Backend:   http://localhost:5001"
echo " - Frontend:  http://localhost:5173"
echo ""

# Keep script alive to watch background processes
wait 