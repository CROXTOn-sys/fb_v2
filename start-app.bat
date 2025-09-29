@echo off
REM Facebook Downloader Startup Script for Windows

echo Starting Facebook Downloader Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo Error: npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo Starting backend server...
cd backend

REM Install backend dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing backend dependencies...
    npm install
)

REM Start backend server in new window
start "Backend Server" cmd /k "npm start"
cd ..

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

echo Starting frontend server...

REM Install frontend dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
)

REM Start frontend server in new window
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ==========================================
echo Facebook Downloader is now running!
echo ==========================================
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5003
echo ==========================================
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo ==========================================
echo.
pause

