const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserBalance,
  deleteUser
} = require('../controllers/userController');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated user ID
 *         name:
 *           type: string
 *           description: User's name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         phone:
 *           type: string
 *           description: User's phone number
 *         balance:
 *           type: number
 *           format: double
 *           description: User's balance
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         name: John Doe
 *         email: john@example.com
 *         phone: 081234567890
 *         balance: 150000.00
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management API
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
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
 *                     $ref: '#/components/schemas/User'
 */
router.get('/', getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
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
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get('/:id', getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               balance:
 *                 type: number
 *                 default: 0
 *             example:
 *               name: John Doe
 *               email: john@example.com
 *               phone: 081234567890
 *               balance: 100000
 *     responses:
 *       201:
 *         description: User created successfully
 *       422:
 *         description: Validation error
 */
router.post('/', createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user information
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *             example:
 *               name: John Doe Updated
 *               email: john.updated@example.com
 *               phone: 081234567899
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       422:
 *         description: Validation error (e.g., email already exists)
 */
router.put('/:id', updateUser);

/**
 * @swagger
 * /api/users/{id}/balance:
 *   patch:
 *     summary: Update user balance
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - balance
 *             properties:
 *               balance:
 *                 type: number
 *                 description: Amount to add/deduct/set
 *               operation:
 *                 type: string
 *                 enum: [add, deduct, set]
 *                 default: add
 *                 description: Operation type
 *             example:
 *               balance: 50000
 *               operation: add
 *     responses:
 *       200:
 *         description: Balance updated successfully
 *       404:
 *         description: User not found
 *       422:
 *         description: Validation error or insufficient balance
 */
router.patch('/:id/balance', updateUserBalance);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:id', deleteUser);

module.exports = router;


