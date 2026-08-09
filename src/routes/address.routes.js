const express = require('express');
const router = express.Router();

const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { validateParams } = require('../middlewares/validate.middleware');
const {
  createAddressSchema,
  updateAddressSchema,
  addressIdParamSchema,
  userIdParamSchema,
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
  validateParams(userIdParamSchema),
  addressController.getAddressesByUserIdAsAdmin
); // Get all addresses of a specific user
router.put(
  '/admin/:id',
  verifyToken,
  isAdmin,
  validateParams(addressIdParamSchema),
  validate(updateAddressSchema),
  addressController.updateAddressAsAdmin
); // Update any address (support)
router.delete(
  '/admin/:id',
  verifyToken,
  isAdmin,
  validateParams(addressIdParamSchema),
  addressController.deleteAddressAsAdmin
); // Delete a problematic address

// ==================== Customer parameterized routes ====================

router.put(
  '/:id',
  verifyToken,
  validateParams(addressIdParamSchema),
  validate(updateAddressSchema),
  addressController.updateAddress
); // Update user's specific address
router.delete(
  '/:id',
  verifyToken,
  validateParams(addressIdParamSchema),
  addressController.deleteAddress
); // Delete user's specific address
router.put(
  '/:id/default',
  verifyToken,
  validateParams(addressIdParamSchema),
  addressController.setAddressAsDefault
); // Set address as default

module.exports = router;
