#!/bin/bash

echo "🚀 Starting DocAi Scheduler..."

# --- Start ML Model (Port 5000) ---
echo "🧠 Starting ML Model on port 5000..."
cd "ML model" || { echo "❌ ML model directory not found"; exit 1; }

# Activate virtual environment (Windows path)
if [ ! -d "venv" ]; then
  echo "📦 Creating virtual environment..."
  python -m venv venv
fi

source venv/Scripts/activate
pip install -r Requirement.txt
python model.py &

cd ..

# --- Start Spring Boot Backend (Port 8080) ---
echo "⚙️ Starting Spring Boot Backend on port 8080..."
cd "backend" || { echo "❌ Spring Boot backend not found"; exit 1; }
./mvnw spring-boot:run &  # or use mvn spring-boot:run if not using wrapper
cd ..

# --- Start Alternate Backend (Port 5001) ---
echo "🧾 Starting Alternate Backend on port 5001..."
cd "D:\DocAi-Scheduler\Frontend\doc-ai-frontend\backend" || { echo "❌ Alternate backend not found"; exit 1; }
npm install
npm start &  # assuming this runs Express backend
cd ../../../..

# --- Start Frontend (Port 5173) ---
echo "🌐 Starting Frontend on port 5173..."
cd "D:\DocAi-Scheduler\Frontend\doc-ai-frontend" || { echo "❌ Frontend not found"; exit 1; }
npm install
npm run dev &

echo ""
echo "✅ All services started. Ports in use:"
echo " - ML Model:      http://localhost:5000"
echo " - Spring Boot:   http://localhost:8080"
echo " - Alt Backend:   http://localhost:5001"
echo " - Frontend:      http://localhost:5173"
echo ""

# Keep script alive to watch background processes
wait
