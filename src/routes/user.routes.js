const express = require('express');
const router = express.Router();

const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { validateParams } = require('../middlewares/validate.middleware');
const { createParamIdSchema } = require('../validators/common.validator');
const {
  updateProfileSchema,
  changePasswordSchema,
  requestPasswordResetSchema,
  verifyPasswordResetSchema,
  changeEmailRequestSchema,
  verifyChangeEmailSchema,
  requestChangePhoneSchema,
  verifyChangePhoneSchema,
  updateUserRoleSchema,
} = require('../validators/user.validator');
const userController = require('../controllers/user.controller');

// ==================== Customer Routes ====================

router.get('/profile', verifyToken, userController.getProfile); // Get logged-in user's profile
router.put(
  '/profile',
  verifyToken,
  validate(updateProfileSchema),
  userController.updateProfile
); // Update logged-in user's profile
router.put(
  '/change-password',
  verifyToken,
  validate(changePasswordSchema),
  userController.changePassword
); // Change logged-in user's password
router.put(
  '/change-password/verify',
  verifyToken,
  validate(verifyPasswordResetSchema),
  userController.verifyChangePassword
); // Confirm new password / verify password reset
router.post(
  '/password-reset/request',
  validate(requestPasswordResetSchema),
  userController.requestPasswordReset
); // Request password reset OTP (public)
router.put(
  '/password-reset/verify',
  validate(verifyPasswordResetSchema),
  userController.verifyChangePassword
); // Verify OTP and set new password (public)
router.post(
  '/change-email/request',
  verifyToken,
  validate(changeEmailRequestSchema),
  userController.requestChangeEmail
); // Request email change (OTP/link)
router.put(
  '/change-email/verify',
  verifyToken,
  validate(verifyChangeEmailSchema),
  userController.verifyChangeEmail
); // Verify OTP and update email
router.post(
  '/change-phone/request',
  verifyToken,
  validate(requestChangePhoneSchema),
  userController.requestChangePhone
); // Request phone change (SMS OTP)
router.put(
  '/change-phone/verify',
  verifyToken,
  validate(verifyChangePhoneSchema),
  userController.verifyChangePhone
); // Verify SMS OTP and update phone

// ==================== Admin Routes ====================

router.get('/', verifyToken, isAdmin, userController.getAllUsers); // Get list of all users
router.get(
  '/:id',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  userController.getUserById
); // Get user details by ID
router.put(
  '/:id',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  validate(updateProfileSchema),
  userController.updateUserById
); // Update user by ID
router.put(
  '/:id/role',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  validate(updateUserRoleSchema),
  userController.updateUserRole
); // Change user role
router.delete(
  '/:id',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  userController.deleteUser
); // Delete or ban a user

module.exports = router;
