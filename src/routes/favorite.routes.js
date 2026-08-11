const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/auth.middleware');
const { validateParams } = require('../middlewares/validate.middleware');
const { createParamIdSchema } = require('../validators/common.validator');
const favoriteController = require('../controllers/favorite.controller');

// ==================== Customer Routes ====================
// All favorite routes require authentication

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     tags: [Favorites]
 *     summary: Get logged-in user's favorites
 *     description: Returns the authenticated user's wishlist, including product details for each favorite.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Favorite'
 *       401:
 *         description: Missing or invalid Bearer token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', verifyToken, favoriteController.getFavorites); // Get logged-in user's favorites

/**
 * @swagger
 * /api/favorites/{itemId}:
 *   post:
 *     tags: [Favorites]
 *     summary: Add a product to favorites
 *     description: Adds the given product to the authenticated user's wishlist.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Product (item) ID to favorite
 *         example: 12
 *     responses:
 *       201:
 *         description: Favorite created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favorite'
 *       401:
 *         description: Missing or invalid Bearer token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Product is already in favorites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags: [Favorites]
 *     summary: Remove a product from favorites
 *     description: Removes the given product from the authenticated user's wishlist.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Product (item) ID to remove from favorites
 *         example: 12
 *     responses:
 *       200:
 *         description: Favorite removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Favorite removed successfully
 *       401:
 *         description: Missing or invalid Bearer token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Favorite or product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
