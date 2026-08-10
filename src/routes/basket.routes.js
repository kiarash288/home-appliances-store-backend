const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { validateParams } = require('../middlewares/validate.middleware');
const { createParamIdSchema } = require('../validators/common.validator');
const {
  addItemSchema,
  updateQuantitySchema,
} = require('../validators/basket.validator');
const basketController = require('../controllers/basket.controller');

// ==================== Customer Routes ====================
// All basket routes require authentication

router.get('/', verifyToken, basketController.getBasket); // Get the logged-in user's active basket
router.post(
  '/items',
  verifyToken,
  validate(addItemSchema),
  basketController.addItem
); // Add a new item to the basket (productId, quantity)
router.put(
  '/items/:itemId',
  verifyToken,
  validateParams(createParamIdSchema('itemId')),
  validate(updateQuantitySchema),
  basketController.updateQuantity
); // Update quantity of a specific item
router.delete(
  '/items/:itemId',
  verifyToken,
  validateParams(createParamIdSchema('itemId')),
  basketController.removeItem
); // Remove a specific item from the basket
router.delete('/', verifyToken, basketController.clearBasket); // Clear the entire basket

module.exports = router;
