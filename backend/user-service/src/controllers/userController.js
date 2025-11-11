const User = require('../models/User');
const { Op } = require('sequelize');

/**
 * Get all users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'balance', 'created_at', 'updated_at']
    });

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message
    });
  }
};

/**
 * Get user by ID
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'balance', 'created_at', 'updated_at']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
      error: error.message
    });
  }
};

/**
 * Create new user
 */
const createUser = async (req, res) => {
  try {
    const { name, email, balance = 0 } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors: {
          name: !name ? 'Name is required' : undefined,
          email: !email ? 'Email is required' : undefined
        }
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors: {
          email: 'Email already exists'
        }
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      balance: balance || 0
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

/**
 * Update user balance
 */
const updateUserBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { balance, operation = 'add' } = req.body;

    // Validation
    if (balance === undefined || balance === null) {
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors: {
          balance: 'Balance is required'
        }
      });
    }

    if (balance < 0) {
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors: {
          balance: 'Balance must be greater than or equal to 0'
        }
      });
    }

    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update balance based on operation
    let newBalance;
    switch (operation) {
      case 'add':
        newBalance = parseFloat(user.balance) + parseFloat(balance);
        break;
      case 'deduct':
        if (parseFloat(user.balance) < parseFloat(balance)) {
          return res.status(422).json({
            success: false,
            message: 'Insufficient balance'
          });
        }
        newBalance = parseFloat(user.balance) - parseFloat(balance);
        break;
      case 'set':
        newBalance = parseFloat(balance);
        break;
      default:
        return res.status(422).json({
          success: false,
          message: 'Invalid operation. Use: add, deduct, or set'
        });
    }

    // Update user
    await user.update({ balance: newBalance });

    // Reload user to get updated balance
    await user.reload();

    res.status(200).json({
      success: true,
      message: 'Balance updated successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: parseFloat(user.balance),
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });
  } catch (error) {
    console.error('Error updating balance:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating balance',
      error: error.message
    });
  }
};

/**
 * Update user info (name, email)
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email} = req.body;

    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(422).json({
          success: false,
          message: 'Validation error',
          errors: {
            email: 'Email already exists'
          }
        });
      }
    }

    // Update user
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    await user.update(updateData);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

/**
 * Delete user
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserBalance,
  deleteUser
};


