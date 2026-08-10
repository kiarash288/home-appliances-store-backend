const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
} = require('../validators/auth.validator');
const authController = require('../controllers/auth.controller');

// ==================== Public Routes ====================
// No authentication required

router.post(
  '/register',
  validate(registerSchema),
  authController.register
); // Register a new user
router.post(
  '/login',
  validate(loginSchema),
  authController.login
); // Login and return Access token (refresh token via HttpOnly cookie)
router.post('/refresh', authController.refresh); // Issue a new Access Token from Refresh Token cookie
router.post(
  '/verify-email',
  validate(verifyEmailSchema),
  authController.verifyEmail
); // Verify email via one-time link token

// ==================== Protected Routes ====================

router.post('/logout', verifyToken, authController.logout); // Logout and invalidate session/refresh token
router.post(
  '/resend-verification',
  verifyToken,
  authController.resendVerification
); // Resend email verification link

module.exports = router;
