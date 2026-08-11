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

router.post(
  '/',
  verifyToken,
  requireVerifiedEmail,
  validate(createOrderSchema),
  orderController.create
); // Create a new order (from current basket)
router.get('/', verifyToken, orderController.getAll); // Get order history for logged-in user

// ==================== Admin Routes ====================
// Registered before /:id so "admin" is not captured as an id param

router.get('/admin', verifyToken, isAdmin, (req, res) => {}); // Get all orders across the platform
router.get('/admin/tracking/:trackingCode', verifyToken, isAdmin, (req, res) => {}); // Find order by tracking code
router.get(
  '/admin/:id',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  (req, res) => {}
); // Get full details of any specific order
router.put(
  '/admin/:id/status',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  validate(updateStatusSchema),
  orderController.updateStatus
); // Update order status
router.delete(
  '/admin/:id',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  (req, res) => {}
); // Soft delete or archive an order

// ==================== Customer Routes (by id) ====================

router.get(
  '/:id',
  verifyToken,
  validateParams(createParamIdSchema('id')),
  orderController.getOne
); // Get full details/receipt of a specific order

// Also support PUT /:id/status for admin as specified
router.put(
  '/:id/status',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  validate(updateStatusSchema),
  orderController.updateStatus
); // Update order status (admin)

module.exports = router;
