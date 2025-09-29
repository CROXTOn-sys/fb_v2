#!/bin/bash

# Facebook Downloader Startup Script
echo "Starting Facebook Downloader Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm first."
    exit 1
fi

# Function to start backend server
start_backend() {
    echo "Starting backend server..."
    cd backend
    
    # Install backend dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "Installing backend dependencies..."
        npm install
    fi
    
    # Start backend server
    npm start &
    BACKEND_PID=$!
    echo "Backend server started with PID: $BACKEND_PID"
    cd ..
}

# Function to start frontend server
start_frontend() {
    echo "Starting frontend server..."
    
    # Install frontend dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "Installing frontend dependencies..."
        npm install
    fi
    
    # Start frontend server
    npm run dev &
    FRONTEND_PID=$!
    echo "Frontend server started with PID: $FRONTEND_PID"
}

# Function to cleanup on exit
cleanup() {
    echo "Shutting down servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start both servers
start_backend
sleep 3  # Wait for backend to start
start_frontend

echo ""
echo "=========================================="
echo "Facebook Downloader is now running!"
echo "=========================================="
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5003"
echo "=========================================="
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user to stop
wait

