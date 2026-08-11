const express = require('express');
const router = express.Router();

const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { validateParams } = require('../middlewares/validate.middleware');
const { createParamIdSchema } = require('../validators/common.validator');
const {
  createAddressSchema,
  updateAddressSchema,
} = require('../validators/address.validator');
const addressController = require('../controllers/address.controller');

// ==================== Customer Routes ====================

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     tags: [Addresses]
 *     summary: List addresses for the logged-in user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 *   post:
 *     tags: [Addresses]
 *     summary: Add a new address
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, city, state, postalCode, fullAddress, phone]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Home
 *               city:
 *                 type: string
 *                 example: Tehran
 *               state:
 *                 type: string
 *                 example: Tehran
 *               postalCode:
 *                 type: string
 *                 example: "1234567890"
 *               fullAddress:
 *                 type: string
 *               phone:
 *                 type: string
 *                 example: "09121234567"
 *               isDefault:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Address created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       400:
 *         description: Validation failed or address limit reached
 *       401:
 *         description: Unauthorized
 */
router.get('/', verifyToken, addressController.getUserAddresses);
router.post(
  '/',
  verifyToken,
  validate(createAddressSchema),
  addressController.addAddress
);

/**
 * @swagger
 * /api/addresses/user/{userId}:
 *   get:
 *     tags: [Addresses]
 *     summary: List addresses for a specific user (admin)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: User addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
  '/user/:userId',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('userId')),
  addressController.getAddressesByUserIdAsAdmin
);

/**
 * @swagger
 * /api/addresses/admin/{id}:
 *   put:
 *     tags: [Addresses]
 *     summary: Update any address (admin)
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
 *             properties:
 *               title:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               fullAddress:
 *                 type: string
 *               phone:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Address updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Address not found
 *   delete:
 *     tags: [Addresses]
 *     summary: Delete any address (admin)
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
 *         description: Address deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Address not found
 */
router.put(
  '/admin/:id',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  validate(updateAddressSchema),
  addressController.updateAddressAsAdmin
);
router.delete(
  '/admin/:id',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  addressController.deleteAddressAsAdmin
);

/**
 * @swagger
 * /api/addresses/{id}:
 *   put:
 *     tags: [Addresses]
 *     summary: Update own address
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
 *             properties:
 *               title:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               fullAddress:
 *                 type: string
 *               phone:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Address updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 *   delete:
 *     tags: [Addresses]
 *     summary: Delete own address
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
 *         description: Address deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
router.put(
  '/:id',
  verifyToken,
  validateParams(createParamIdSchema('id')),
  validate(updateAddressSchema),
  addressController.updateAddress
);
router.delete(
  '/:id',
  verifyToken,
  validateParams(createParamIdSchema('id')),
  addressController.deleteAddress
);

/**
 * @swagger
 * /api/addresses/{id}/default:
 *   put:
 *     tags: [Addresses]
 *     summary: Set address as default
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
 *         description: Default address updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
router.put(
  '/:id/default',
  verifyToken,
  validateParams(createParamIdSchema('id')),
  addressController.setAddressAsDefault
);

module.exports = router;
