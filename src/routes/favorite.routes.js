const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/auth.middleware');
const { validateParams } = require('../middlewares/validate.middleware');
const { createParamIdSchema } = require('../validators/common.validator');
const favoriteController = require('../controllers/favorite.controller');

// ==================== Customer Routes ====================
// All favorite routes require authentication

router.get('/', verifyToken, favoriteController.getFavorites); // Get logged-in user's favorites
router.post(
  '/:itemId',
  verifyToken,
  validateParams(createParamIdSchema('itemId')),
  favoriteController.add
); // Add item to favorites
router.delete(
  '/:itemId',
  verifyToken,
  validateParams(createParamIdSchema('itemId')),
  favoriteController.remove
); // Remove item from favorites

module.exports = router;
