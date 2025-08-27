@echo off
echo Starting VisionAI Assistant Full-Stack Application...
echo.

echo Starting Backend (Flask API)...
cd backend
start "Backend" cmd /k "python -m venv .venv && .venv\Scripts\activate && pip install -r requirements.txt && python app.py"

echo.
echo Starting Frontend (React/Vite)...
cd ..\malaysia-explore-ai
start "Frontend" cmd /k "npm install && npm run dev"

echo.
echo Applications are starting...
echo Backend will be available at: http://localhost:5001
echo Frontend will be available at: http://localhost:5173
echo.
echo Press any key to exit this launcher...
pause > nul
