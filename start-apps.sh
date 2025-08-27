#!/bin/bash

echo "Starting VisionAI Assistant Full-Stack Application..."
echo

echo "Starting Backend (Flask API)..."
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py &
BACKEND_PID=$!

echo
echo "Starting Frontend (React/Vite)..."
cd ../malaysia-explore-ai
npm install
npm run dev &
FRONTEND_PID=$!

echo
echo "Applications are starting..."
echo "Backend will be available at: http://localhost:5001"
echo "Frontend will be available at: http://localhost:5173"
echo
echo "Press Ctrl+C to stop both applications..."

# Wait for user to stop
trap "echo 'Stopping applications...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
