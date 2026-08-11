const express = require('express');
const router = express.Router();

const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { requireVerifiedEmail } = require('../middlewares/verifyEmail.middleware');
const validate = require('../middlewares/validate.middleware');
const { validateParams } = require('../middlewares/validate.middleware');
const { createParamIdSchema } = require('../validators/common.validator');
const {
  createOrderSchema,
  updateStatusSchema,
} = require('../validators/order.validator');
const orderController = require('../controllers/order.controller');

// ==================== Customer Routes ====================

/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create an order from the current basket
 *     description: Requires a verified email. Runs inside a Sequelize transaction (stock, order items, clear basket).
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [addressId]
 *             properties:
 *               addressId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Order created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Empty basket, insufficient stock, or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Email not verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     tags: [Orders]
 *     summary: List orders for the logged-in user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User order history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/',
  verifyToken,
  requireVerifiedEmail,
  validate(createOrderSchema),
  orderController.create
);
router.get('/', verifyToken, orderController.getAll);

// ==================== Admin Routes ====================

/**
 * @swagger
 * /api/orders/admin:
 *   get:
 *     tags: [Orders]
 *     summary: List all orders (admin)
 *     description: Admin-only. Handler may be a stub pending full implementation.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All platform orders
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/admin', verifyToken, isAdmin, orderController.getAllAsAdmin);

/**
 * @swagger
 * /api/orders/admin/tracking/{trackingCode}:
 *   get:
 *     tags: [Orders]
 *     summary: Find order by tracking code (admin)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trackingCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Order not found
 */
router.get(
  '/admin/tracking/:trackingCode',
  verifyToken,
  isAdmin,
  orderController.getByTrackingCode
);

/**
 * @swagger
 * /api/orders/admin/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get any order by ID (admin)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Order not found
 *   delete:
 *     tags: [Orders]
 *     summary: Delete or archive an order (admin)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Order deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Order not found
 */
router.get(
  '/admin/:id',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  orderController.getOneAsAdmin
);
router.delete(
  '/admin/:id',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  orderController.removeAsAdmin
);

/**
 * @swagger
 * /api/orders/admin/{id}/status:
 *   put:
 *     tags: [Orders]
 *     summary: Update order status (admin)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
 *                 example: SHIPPED
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Order not found
 */
router.put(
  '/admin/:id/status',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  validate(updateStatusSchema),
  orderController.updateStatus
);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get own order by ID
 *     description: Zero-trust — only returns the order if it belongs to the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Order details / receipt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/:id',
  verifyToken,
  validateParams(createParamIdSchema('id')),
  orderController.getOne
);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     tags: [Orders]
 *     summary: Update order status (admin alias)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Order not found
 */
router.put(
  '/:id/status',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  validate(updateStatusSchema),
  orderController.updateStatus
);

module.exports = router;
