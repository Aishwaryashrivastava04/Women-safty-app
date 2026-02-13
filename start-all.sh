#!/bin/bash
# Quick Setup Script - Run all services at once

echo "🚀 Starting Women Safety App (Full Stack)"
echo "=========================================="
echo ""

# Check if processes already running
BACKEND_PID=$(pgrep -f "node server.js" | head -1)
FRONTEND_PID=$(pgrep -f "npm run dev" | grep -v grep | head -1)

# Stop if already running
if [ ! -z "$BACKEND_PID" ]; then
    echo "⚠️  Backend already running (PID: $BACKEND_PID)"
    echo "Kill it? (y/n): "
    # read -r response
    # if [ "$response" = "y" ]; then
    #     kill -9 $BACKEND_PID
    # fi
fi

if [ ! -z "$FRONTEND_PID" ]; then
    echo "⚠️  Frontend already running (PID: $FRONTEND_PID)"
fi

echo ""
echo "Starting backend..."
cd "/Users/ash/Desktop/women-safety 2/women-safety-app/be/Bakend"
node server.js > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"
echo "   Logs: tail -f /tmp/backend.log"
echo ""

echo "Starting frontend (Vite Dev Server)..."
cd "/Users/ash/Desktop/women-safety 2/women-safety-app/Frontend"
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo "   Logs: tail -f /tmp/frontend.log"
echo ""

sleep 2

echo "=========================================="
echo "✅ ALL SERVICES RUNNING"
echo "=========================================="
echo ""
echo "📊 Access Points:"
echo "   • Website:    http://localhost:5173"
echo "   • Backend:    http://localhost:3000"
echo "   • Mac IP:     192.168.0.102"
echo "   • Phone IP:   192.168.0.102:3000"
echo ""
echo "🧪 Quick Tests:"
echo "   curl http://localhost:3000/api"
echo "   curl http://localhost:5173"
echo ""
echo "⏸️  To Stop:"
echo "   kill $BACKEND_PID  # Backend"
echo "   kill $FRONTEND_PID # Frontend"
echo ""
echo "📱 On Android Emulator:"
echo "   http://10.0.2.2:5173 (UI)"
echo "   http://10.0.2.2:3000 (API)"
echo ""
