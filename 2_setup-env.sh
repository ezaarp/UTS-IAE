#!/bin/bash
echo "========================================"
echo "  Creating .env files..."
echo "========================================"
echo ""

# Create .env for User Service
echo "Creating .env for User Service..."
cat > backend/user-service/.env << 'EOF'
# Server Configuration
PORT=8001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=user_service
DB_DIALECT=mysql

# JWT Configuration
JWT_SECRET=digital_payment_secret_key_2025
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
EOF

echo "User Service .env created!"
echo ""

# Create .env for Payment Service
echo "Creating .env for Payment Service..."
cat > backend/payment-service/.env << 'EOF'
# Server Configuration
PORT=8002
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=payment_service
DB_DIALECT=mysql

# JWT Configuration
JWT_SECRET=digital_payment_secret_key_2025
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# User Service URL
USER_SERVICE_URL=http://localhost:8001/api
EOF

echo "Payment Service .env created!"
echo ""

# Create .env for Frontend
echo "Creating .env for Frontend..."
cat > frontend-react/.env << 'EOF'
# API Configuration
VITE_USER_SERVICE_URL=http://localhost:8001/api
VITE_PAYMENT_SERVICE_URL=http://localhost:8002/api
EOF

echo "Frontend .env created!"
echo ""

echo "========================================"
echo "  All .env files created successfully!"
echo "========================================"
echo ""
echo "IMPORTANT: Please update DB_PASSWORD in both backend .env files"
echo "with your MySQL root password if you have one."
echo ""

