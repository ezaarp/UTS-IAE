@echo off
echo ========================================
echo   Creating .env files...
echo ========================================
echo.

REM Create .env for User Service
echo Creating .env for User Service...
(
echo # Server Configuration
echo PORT=8001
echo NODE_ENV=development
echo.
echo # Database Configuration
echo DB_HOST=localhost
echo DB_USER=root
echo DB_PASSWORD=
echo DB_NAME=user_service
echo DB_DIALECT=mysql
echo.
echo # JWT Configuration
echo JWT_SECRET=digital_payment_secret_key_2025
echo JWT_EXPIRES_IN=24h
echo.
echo # CORS Configuration
echo CORS_ORIGIN=http://localhost:3000
) > backend\user-service\.env

echo User Service .env created!
echo.

REM Create .env for Payment Service
echo Creating .env for Payment Service...
(
echo # Server Configuration
echo PORT=8002
echo NODE_ENV=development
echo.
echo # Database Configuration
echo DB_HOST=localhost
echo DB_USER=root
echo DB_PASSWORD=
echo DB_NAME=payment_service
echo DB_DIALECT=mysql
echo.
echo # JWT Configuration
echo JWT_SECRET=digital_payment_secret_key_2025
echo JWT_EXPIRES_IN=24h
echo.
echo # CORS Configuration
echo CORS_ORIGIN=http://localhost:3000
echo.
echo # User Service URL
echo USER_SERVICE_URL=http://localhost:8001/api
) > backend\payment-service\.env

echo Payment Service .env created!
echo.

REM Create .env for Frontend
echo Creating .env for Frontend...
(
echo # API Configuration
echo VITE_USER_SERVICE_URL=http://localhost:8001/api
echo VITE_PAYMENT_SERVICE_URL=http://localhost:8002/api
) > frontend-react\.env

echo Frontend .env created!
echo.

echo ========================================
echo   All .env files created successfully!
echo ========================================
echo.
echo IMPORTANT: Please update DB_PASSWORD in both backend .env files
echo with your MySQL root password if you have one.
echo.
echo Press any key to continue...
pause >nul


