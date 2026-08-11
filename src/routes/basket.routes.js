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

/**
 * @swagger
 * /api/baskets:
 *   get:
 *     tags: [Basket]
 *     summary: Get the active basket
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current basket with line items
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Basket'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags: [Basket]
 *     summary: Clear the entire basket
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Basket cleared
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', verifyToken, basketController.getBasket);
router.delete('/', verifyToken, basketController.clearBasket);

/**
 * @swagger
 * /api/baskets/items:
 *   post:
 *     tags: [Basket]
 *     summary: Add a product to the basket
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, quantity]
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 12
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 100
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item added; returns updated basket
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Basket'
 *       400:
 *         description: Insufficient stock or validation error
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
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/items',
  verifyToken,
  validate(addItemSchema),
  basketController.addItem
);

/**
 * @swagger
 * /api/baskets/items/{itemId}:
 *   put:
 *     tags: [Basket]
 *     summary: Update quantity of a basket line
 *     description: Set quantity to 0 to remove the line.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
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
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 3
 *     responses:
 *       200:
 *         description: Basket updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Basket'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Basket item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags: [Basket]
 *     summary: Remove a product from the basket
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Item removed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Basket'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Basket item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  '/items/:itemId',
  verifyToken,
  validateParams(createParamIdSchema('itemId')),
  validate(updateQuantitySchema),
  basketController.updateQuantity
);
router.delete(
  '/items/:itemId',
  verifyToken,
  validateParams(createParamIdSchema('itemId')),
  basketController.removeItem
);

module.exports = router;
