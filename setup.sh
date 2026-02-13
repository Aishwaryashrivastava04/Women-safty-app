#!/bin/bash

# 🚀 COMPLETE SETUP GUIDE - Women Safety App

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           🎯 WOMENs SAFETY APP - COMPLETE SETUP                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "✅ STEP 1: Kill any old processes"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
killall node 2>/dev/null || true
sleep 1
echo "Done."
echo ""

echo "✅ STEP 2: Clear ports 3000 and 5173"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
lsof -i :3000 | grep -v COMMAND | awk '{print $2}' | xargs kill -9 2>/dev/null || true
lsof -i :5173 | grep -v COMMAND | awk '{print $2}' | xargs kill -9 2>/dev/null || true
sleep 1
echo "Ports cleared."
echo ""

echo "✅ STEP 3: Start Backend Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd "/Users/ash/Desktop/women-safety 2/women-safety-app/be/Bakend"
node server.js > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
sleep 2
echo "Backend started (PID: $BACKEND_PID)"
echo "Logs: tail -f /tmp/backend.log"
echo ""

echo "✅ STEP 4: Start Frontend Development Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd "/Users/ash/Desktop/women-safety 2/women-safety-app/Frontend"
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 3
echo "Frontend started (PID: $FRONTEND_PID)"
echo "Logs: tail -f /tmp/frontend.log"
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    ✅ ALL SERVERS RUNNING!                     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "📊 ENDPOINTS:"
echo "  • Frontend:        http://localhost:5173"
echo "  • Backend API:     http://localhost:3000/api"
echo "  • Debug Page:      http://localhost:5173/debug.html"
echo ""

echo "🤖 FOR ANDROID EMULATOR:"
echo "  • Frontend:        http://10.0.2.2:5173"
echo "  • Backend:         http://10.0.2.2:3000"
echo "  • Debug Page:      http://10.0.2.2:5173/debug.html"
echo ""

echo "📱 FOR PHYSICAL ANDROID DEVICE:"
echo "  • Frontend:        http://192.168.0.102:5173"
echo "  • Backend:         http://192.168.0.102:3000"
echo "  • Debug Page:      http://192.168.0.102:5173/debug.html"
echo ""

echo "🧪 QUICK TESTS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Test Backend:"
curl -s http://localhost:3000/api
echo ""
echo ""

echo "Test Frontend Loading:"
echo -n "  "
curl -s http://localhost:5173 | grep -o "<title>.*</title>"
echo ""
echo ""

echo "📝 PROCESS INFO:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Backend PID:  $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""

echo "⏸️  TO STOP SERVICES:"
echo "  kill $BACKEND_PID   # Stop backend"
echo "  kill $FRONTEND_PID  # Stop frontend"
echo ""

echo "🧪 NEXT STEPS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. On your Mac browser, go to:"
echo "   http://localhost:5173/debug.html"
echo ""
echo "2. Click 'Show Environment' to verify setup"
echo "3. Click 'Test Localhost:3000' to verify connection"
echo "4. Try Register/Login manually"
echo ""
echo "5. On Android Emulator, go to:"
echo "   http://10.0.2.2:5173/debug.html"
echo ""
echo "6. Check that 'Is Android: true'"
echo "7. Test 10.0.2.2:3000 backend"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "👋 If login/register still not working, check:"
echo "   • DEBUG_GUIDE.md for detailed troubleshooting"
echo "   • Run: tail -f /tmp/backend.log"
echo "   • Run: tail -f /tmp/frontend.log"
echo ""
