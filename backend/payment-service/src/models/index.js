const { sequelize } = require('../config/database');
const Transaction = require('./Transaction');

// Initialize models
const db = {
  sequelize,
  Transaction
};

// Sync database (create tables if not exist)
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: false }); // Set to true in development to auto-update schema
    console.log('✅ Database synchronized successfully');
  } catch (error) {
    console.error('❌ Database sync error:', error);
  }
};

module.exports = { db, syncDatabase };


