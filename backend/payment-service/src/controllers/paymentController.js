const Transaction = require('../models/Transaction');
const { getUserById, updateUserBalance } = require('../services/userService');
const { sequelize } = require('../config/database');

/**
 * Get all transactions
 */
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      order: [['created_at', 'DESC']],
      attributes: ['id', 'user_id', 'target_user_id', 'type', 'amount', 'status', 'description', 'created_at', 'updated_at']
    });

    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving transactions',
      error: error.message
    });
  }
};

/**
 * Get transaction by ID
 */
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error getting transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving transaction',
      error: error.message
    });
  }
};

/**
 * Top-up user balance
 */
const topup = async (req, res) => {
  // Start transaction
  const t = await sequelize.transaction();

  try {
    const { user_id, amount } = req.body;

    // Validation
    if (!user_id || !amount) {
      await t.rollback();
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors: {
          user_id: !user_id ? 'User ID is required' : undefined,
          amount: !amount ? 'Amount is required' : undefined
        }
      });
    }

    if (amount < 10000) {
      await t.rollback();
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors: {
          amount: 'Minimum top-up amount is 10000'
        }
      });
    }

    // Call User Service to update balance
    try {
      await updateUserBalance(user_id, amount, 'add');
    } catch (error) {
      await t.rollback();
      return res.status(500).json({
        success: false,
        message: 'Failed to update user balance: ' + error.message
      });
    }

    // Save transaction
    const transaction = await Transaction.create({
      user_id,
      type: 'topup',
      amount,
      status: 'success',
      description: 'Top-up balance'
    }, { transaction: t });

    // Commit transaction
    await t.commit();

    res.status(200).json({
      success: true,
      message: 'Top-up successful',
      data: {
        transaction_id: transaction.id,
        user_id: transaction.user_id,
        amount: transaction.amount,
        type: transaction.type,
        status: transaction.status,
        created_at: transaction.created_at
      }
    });
  } catch (error) {
    await t.rollback();
    console.error('Top-up error:', error);
    res.status(500).json({
      success: false,
      message: 'Top-up failed: ' + error.message
    });
  }
};

/**
 * Transfer between users
 */
const transfer = async (req, res) => {
  // Start transaction
  const t = await sequelize.transaction();

  try {
    const { user_id, target_user_id, amount } = req.body;

    // Validation
    if (!user_id || !target_user_id || !amount) {
      await t.rollback();
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors: {
          user_id: !user_id ? 'Sender user ID is required' : undefined,
          target_user_id: !target_user_id ? 'Receiver user ID is required' : undefined,
          amount: !amount ? 'Amount is required' : undefined
        }
      });
    }

    if (user_id === target_user_id) {
      await t.rollback();
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors: {
          target_user_id: 'Cannot transfer to yourself'
        }
      });
    }

    if (amount < 10000) {
      await t.rollback();
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors: {
          amount: 'Minimum transfer amount is 10000'
        }
      });
    }

    // Check sender exists and has sufficient balance
    let sender;
    try {
      const senderResponse = await getUserById(user_id);
      sender = senderResponse.data;
    } catch (error) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Sender not found'
      });
    }

    if (parseFloat(sender.balance) < parseFloat(amount)) {
      await t.rollback();
      return res.status(422).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Check receiver exists
    try {
      await getUserById(target_user_id);
    } catch (error) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    // Deduct from sender
    try {
      await updateUserBalance(user_id, amount, 'deduct');
    } catch (error) {
      await t.rollback();
      return res.status(500).json({
        success: false,
        message: 'Failed to deduct balance from sender: ' + error.message
      });
    }

    // Add to receiver
    try {
      await updateUserBalance(target_user_id, amount, 'add');
    } catch (error) {
      await t.rollback();
      return res.status(500).json({
        success: false,
        message: 'Failed to add balance to receiver: ' + error.message
      });
    }

    // Save transaction
    const transaction = await Transaction.create({
      user_id,
      target_user_id,
      type: 'transfer',
      amount,
      status: 'success',
      description: `Transfer from user ${user_id} to user ${target_user_id}`
    }, { transaction: t });

    // Commit transaction
    await t.commit();

    res.status(200).json({
      success: true,
      message: 'Transfer successful',
      data: {
        transaction_id: transaction.id,
        user_id: transaction.user_id,
        target_user_id: transaction.target_user_id,
        amount: transaction.amount,
        type: transaction.type,
        status: transaction.status,
        created_at: transaction.created_at
      }
    });
  } catch (error) {
    await t.rollback();
    console.error('Transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'Transfer failed: ' + error.message
    });
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  topup,
  transfer
};


