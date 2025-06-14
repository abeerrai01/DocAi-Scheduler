#!/bin/bash

echo "🚀 Starting DocAi Scheduler..."

# --- Start ML Model (Port 5050) ---
echo "🧠 Starting ML Model on port 5050..."
cd "/Users/pushpendratripathi/Desktop/git/DocAi-Scheduler/ML model" || { echo "❌ ML model directory not found"; exit 1; }

# Activate virtual environment (macOS/Linux path)
if [ ! -d "venv" ]; then
  echo "📦 Creating virtual environment..."
  python3 -m venv venv
fi

# Ensure we're using the virtual environment's Python
source venv/bin/activate
echo "📦 Installing/Updating requirements..."
python3 -m pip install --upgrade pip
python3 -m pip install -r Requirement.txt

# Verify Flask installation
echo "🔍 Verifying Flask installation..."
python3 -c "import flask; print(f'Flask version: {flask.__version__}')" || { echo "❌ Flask installation failed"; exit 1; }

# Start the ML model
python3 model.py &

cd ../..

# --- Start Spring Boot Backend (Port 8080) ---
echo "⚙️ Starting Spring Boot Backend on port 8080..."
cd "/Users/pushpendratripathi/Desktop/git/DocAi-Scheduler/backend" || { echo "❌ Spring Boot backend not found"; exit 1; }
chmod +x mvnw
./mvnw spring-boot:run &  # or use mvn spring-boot:run if not using wrapper
cd ../..

# --- Start Alternate Backend (Port 5001) ---
echo "🧾 Starting Alternate Backend on port 5001..."
cd "/Users/pushpendratripathi/Desktop/git/DocAi-Scheduler/Frontend/doc-ai-frontend/backend" || { echo "❌ Alternate backend not found"; exit 1; }
npm install
npm start &  # assuming this runs Express backend
cd ../../..

# --- Start Frontend (Port 5173) ---
echo "🌐 Starting Frontend on port 5173..."
cd "/Users/pushpendratripathi/Desktop/git/DocAi-Scheduler/Frontend/doc-ai-frontend" || { echo "❌ Frontend not found"; exit 1; }
npm install
npm run dev &

echo ""
echo "✅ All services started. Ports in use:"
echo " - ML Model:      http://localhost:5050"
echo " - Spring Boot:   http://localhost:8080"
echo " - Alt Backend:   http://localhost:5001"
echo " - Frontend:      http://localhost:5173"
echo ""

# Keep script alive to watch background processes
wait