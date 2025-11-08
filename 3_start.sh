#!/bin/bash
echo "========================================"
echo "  Digital Payment E-Wallet"
echo "  Starting All Services..."
echo "========================================"
echo ""

# Start User Service (Port 8001)
echo "[1/3] Starting User Service on port 8001..."
osascript -e 'tell app "Terminal" to do script "cd \"'"$(pwd)"'/backend/user-service\" && npm run dev"' > /dev/null 2>&1
echo "Waiting for User Service to initialize..."
sleep 5

# Start Payment Service (Port 8002)
echo "[2/3] Starting Payment Service on port 8002..."
osascript -e 'tell app "Terminal" to do script "cd \"'"$(pwd)"'/backend/payment-service\" && npm run dev"' > /dev/null 2>&1
echo "Waiting for Payment Service to initialize..."
sleep 5

# Start React Frontend (Port 3000)
echo "[3/3] Starting React Frontend on port 3000..."
osascript -e 'tell app "Terminal" to do script "cd \"'"$(pwd)"'/frontend-react\" && npm run dev"' > /dev/null 2>&1
sleep 3

echo ""
echo "========================================"
echo "  All Services Started!"
echo "========================================"
echo ""
echo "Frontend:         http://localhost:3000"
echo "User Service:     http://localhost:8001"
echo "Payment Service:  http://localhost:8002"
echo ""
echo "User API Docs:    http://localhost:8001/api-docs"
echo "Payment API Docs: http://localhost:8002/api-docs"
echo ""
echo "Opening frontend in browser..."
sleep 2

open http://localhost:3000

