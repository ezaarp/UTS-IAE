@echo off
echo ========================================
echo   Digital Payment E-Wallet
echo   Starting All Services...
echo ========================================
echo.

REM Start User Service (Port 8001)
echo [1/3] Starting User Service on port 8001...
start "User Service" cmd /k "cd backend\user-service && npm run dev"
echo Waiting for User Service to initialize...
timeout /t 5 >nul

REM Start Payment Service (Port 8002)
echo [2/3] Starting Payment Service on port 8002...
start "Payment Service" cmd /k "cd backend\payment-service && npm run dev"
echo Waiting for Payment Service to initialize...
timeout /t 5 >nul

REM Start React Frontend (Port 3000)
echo [3/3] Starting React Frontend on port 3000...
start "React Frontend" cmd /k "cd frontend-react && npm run dev"
timeout /t 3 >nul

echo.
echo ========================================
echo   All Services Started!
echo ========================================
echo.
echo Frontend:         http://localhost:3000
echo User Service:     http://localhost:8001
echo Payment Service:  http://localhost:8002
echo.
echo User API Docs:    http://localhost:8001/api-docs
echo Payment API Docs: http://localhost:8002/api-docs
echo.
echo Press any key to open frontend in browser...
pause >nul

start http://localhost:3000

