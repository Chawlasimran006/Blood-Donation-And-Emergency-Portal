@echo off
echo ====================================
echo Starting Blood Donation Application
echo ====================================
echo.
echo This will start BOTH servers:
echo  - Backend (Node.js) on http://localhost:5000
echo  - Frontend (React) on http://localhost:3002
echo.
echo Press Ctrl+C to stop both servers
echo ====================================
echo.

cd react-app
start cmd /k "npm run dev"

echo.
echo Servers are starting...
echo Wait a few seconds, then open http://localhost:3002 in your browser
echo.
pause
