// API Configuration
export const API_CONFIG = {
  userServiceUrl: import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8001/api',
  paymentServiceUrl: import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:8002/api'
};


