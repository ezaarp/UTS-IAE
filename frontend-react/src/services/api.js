import axios from 'axios';
import { API_CONFIG } from '../config/api';

// Create axios instances for each service
const userServiceAPI = axios.create({
  baseURL: API_CONFIG.userServiceUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

const paymentServiceAPI = axios.create({
  baseURL: API_CONFIG.paymentServiceUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// User Service APIs
export const userAPI = {
  // Get all users
  getAllUsers: () => userServiceAPI.get('/users'),
  
  // Get user by ID
  getUserById: (id) => userServiceAPI.get(`/users/${id}`),
  
  // Create new user
  createUser: (data) => userServiceAPI.post('/users', data),
  
  // Update user balance
  updateUserBalance: (id, data) => userServiceAPI.put(`/users/${id}`, data),
  
  // Delete user
  deleteUser: (id) => userServiceAPI.delete(`/users/${id}`)
};

// Payment Service APIs
export const paymentAPI = {
  // Get all transactions
  getAllTransactions: () => paymentServiceAPI.get('/transactions'),
  
  // Get transaction by ID
  getTransactionById: (id) => paymentServiceAPI.get(`/transactions/${id}`),
  
  // Top-up balance
  topup: (data) => paymentServiceAPI.post('/transactions/topup', data),
  
  // Transfer between users
  transfer: (data) => paymentServiceAPI.post('/transactions/transfer', data)
};

export default { userAPI, paymentAPI };


