const express = require('express');
const router = express.Router();
const {
  getAllTransactions,
  getTransactionById,
  topup,
  transfer
} = require('../controllers/paymentController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - user_id
 *         - type
 *         - amount
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated transaction ID
 *         user_id:
 *           type: integer
 *           description: Sender/User ID
 *         target_user_id:
 *           type: integer
 *           description: Receiver user ID (for transfer)
 *         type:
 *           type: string
 *           enum: [topup, transfer]
 *           description: Transaction type
 *         amount:
 *           type: number
 *           format: double
 *           description: Transaction amount
 *         status:
 *           type: string
 *           description: Transaction status
 *         description:
 *           type: string
 *           description: Transaction description
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         user_id: 1
 *         target_user_id: 2
 *         type: transfer
 *         amount: 50000.00
 *         status: success
 *         description: Transfer from user 1 to user 2
 */

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Payment transaction management API
 */

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 */
router.get('/', getAllTransactions);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Transaction not found
 */
router.get('/:id', getTransactionById);

/**
 * @swagger
 * /api/transactions/topup:
 *   post:
 *     summary: Top-up user balance
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - amount
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: User ID to top-up
 *               amount:
 *                 type: number
 *                 description: Top-up amount (minimum 10000)
 *             example:
 *               user_id: 1
 *               amount: 50000
 *     responses:
 *       200:
 *         description: Top-up successful
 *       422:
 *         description: Validation error
 *       500:
 *         description: Failed to update user balance
 */
router.post('/topup', topup);

/**
 * @swagger
 * /api/transactions/transfer:
 *   post:
 *     summary: Transfer between users
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - target_user_id
 *               - amount
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: Sender user ID
 *               target_user_id:
 *                 type: integer
 *                 description: Receiver user ID
 *               amount:
 *                 type: number
 *                 description: Transfer amount (minimum 10000)
 *             example:
 *               user_id: 1
 *               target_user_id: 2
 *               amount: 25000
 *     responses:
 *       200:
 *         description: Transfer successful
 *       404:
 *         description: User not found
 *       422:
 *         description: Validation error or insufficient balance
 *       500:
 *         description: Transfer failed
 */
router.post('/transfer', transfer);

module.exports = router;


