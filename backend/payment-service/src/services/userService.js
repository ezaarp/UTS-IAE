const axios = require('axios');
require('dotenv').config();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:8001/api';

/**
 * Get user by ID from User Service
 */
const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user from User Service:', error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch user');
  }
};

/**
 * Update user balance in User Service
 */
const updateUserBalance = async (userId, amount, operation = 'add') => {
  try {
    const response = await axios.patch(`${USER_SERVICE_URL}/users/${userId}/balance`, {
      balance: amount,
      operation: operation
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user balance:', error.message);
    throw new Error(error.response?.data?.message || 'Failed to update user balance');
  }
};

module.exports = {
  getUserById,
  updateUserBalance
};


