@echo off
echo Installing dependencies for all services...
echo.

echo [1/3] Installing User Service dependencies...
cd backend\user-service
call npm install
cd ..\..

echo [2/3] Installing Payment Service dependencies...
cd backend\payment-service
call npm install
cd ..\..

echo [3/3] Installing Frontend dependencies...
cd frontend-react
call npm install
cd ..

echo.
echo All dependencies installed!
pause