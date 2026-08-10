const express = require('express');
const router = express.Router();

const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { validateParams } = require('../middlewares/validate.middleware');
const { createParamIdSchema } = require('../validators/common.validator');
const {
  createItemSchema,
  updateItemSchema,
} = require('../validators/item.validator');
const itemController = require('../controllers/item.controller');

// ==================== Public Routes ====================
// No authentication required

router.get('/', itemController.getAll); // Get all items (search, filter, pagination via query)
router.get(
  '/:id',
  validateParams(createParamIdSchema('id')),
  itemController.getOne
); // Get full item details by ID

// ==================== Customer Routes ====================

router.post(
  '/:id/favorite',
  verifyToken,
  validateParams(createParamIdSchema('id')),
  (req, res) => {}
); // Add item to favorites
router.delete(
  '/:id/favorite',
  verifyToken,
  validateParams(createParamIdSchema('id')),
  (req, res) => {}
); // Remove item from favorites

// ==================== Admin Routes ====================

router.post(
  '/',
  verifyToken,
  isAdmin,
  validate(createItemSchema),
  itemController.create
); // Create a new item
router.put(
  '/:id',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  validate(updateItemSchema),
  itemController.update
); // Update item details
router.delete(
  '/:id',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  itemController.remove
); // Delete an item

module.exports = router;
