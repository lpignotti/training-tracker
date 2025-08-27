#!/bin/bash

# Start both React frontend and Node.js backend

echo "🚀 Starting React App with Backend..."

# Kill any existing processes on ports 3000 and 3001
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Start backend server in background
echo "🔧 Starting backend server on port 3001..."
cd ../../backend && npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start React frontend
echo "⚛️  Starting React frontend on port 3000..."
cd ../ && npm start &
FRONTEND_PID=$!

echo "✅ Both servers started successfully!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:3001"
echo "🏥 Health:   http://localhost:3001/api/health"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    echo "✅ Servers stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for processes
wait
