#!/bin/bash

# Script to kill React development servers

echo "🔍 Searching for React development servers..."

# Method 1: Kill by port 3000
if lsof -ti:3000 >/dev/null 2>&1; then
    echo "📦 Found process on port 3000"
    PID=$(lsof -ti:3000)
    echo "   PID: $PID"
    kill -9 $PID 2>/dev/null
    echo "✅ Killed process on port 3000"
else
    echo "ℹ️  No process found on port 3000"
fi

# Method 2: Kill react-scripts processes
REACT_PIDS=$(pgrep -f "react-scripts" 2>/dev/null)
if [ ! -z "$REACT_PIDS" ]; then
    echo "📦 Found react-scripts processes: $REACT_PIDS"
    pkill -f "react-scripts"
    echo "✅ Killed react-scripts processes"
else
    echo "ℹ️  No react-scripts processes found"
fi

# Method 3: Kill npm start processes
NPM_PIDS=$(pgrep -f "npm.*start" 2>/dev/null)
if [ ! -z "$NPM_PIDS" ]; then
    echo "📦 Found npm start processes: $NPM_PIDS"
    pkill -f "npm.*start"
    echo "✅ Killed npm start processes"
else
    echo "ℹ️  No npm start processes found"
fi

echo ""
echo "🏁 React server cleanup complete!"
echo ""
echo "To verify no React servers are running:"
echo "   lsof -ti:3000"
echo "   ps aux | grep 'react-scripts\\|npm.*start' | grep -v grep"
