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

router.get('/', verifyToken, addressController.getUserAddresses); // Get all addresses for logged-in user
router.post(
  '/',
  verifyToken,
  validate(createAddressSchema),
  addressController.addAddress
); // Add a new address

// ==================== Admin Routes ====================
// Registered before /:id so "admin" / "user" are not captured as ids

router.get(
  '/user/:userId',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('userId')),
  addressController.getAddressesByUserIdAsAdmin
); // Get all addresses of a specific user
router.put(
  '/admin/:id',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  validate(updateAddressSchema),
  addressController.updateAddressAsAdmin
); // Update any address (support)
router.delete(
  '/admin/:id',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  addressController.deleteAddressAsAdmin
); // Delete a problematic address

// ==================== Customer parameterized routes ====================

router.put(
  '/:id',
  verifyToken,
  validateParams(createParamIdSchema('id')),
  validate(updateAddressSchema),
  addressController.updateAddress
); // Update user's specific address
router.delete(
  '/:id',
  verifyToken,
  validateParams(createParamIdSchema('id')),
  addressController.deleteAddress
); // Delete user's specific address
router.put(
  '/:id/default',
  verifyToken,
  validateParams(createParamIdSchema('id')),
  addressController.setAddressAsDefault
); // Set address as default

module.exports = router;
