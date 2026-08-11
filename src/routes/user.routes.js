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

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get logged-in user profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *   put:
 *     tags: [Users]
 *     summary: Update logged-in user profile
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', verifyToken, userController.getProfile);
router.put(
  '/profile',
  verifyToken,
  validate(updateProfileSchema),
  userController.updateProfile
);

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     tags: [Users]
 *     summary: Request password change (authenticated)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: OTP / verification step initiated
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/change-password',
  verifyToken,
  validate(changePasswordSchema),
  userController.changePassword
);

/**
 * @swagger
 * /api/users/change-password/verify:
 *   put:
 *     tags: [Users]
 *     summary: Confirm password change with OTP
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, newPassword]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *                 example: "12345"
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password updated
 *       400:
 *         description: Invalid OTP
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/change-password/verify',
  verifyToken,
  validate(verifyPasswordResetSchema),
  userController.verifyChangePassword
);

/**
 * @swagger
 * /api/users/password-reset/request:
 *   post:
 *     tags: [Users]
 *     summary: Request password-reset OTP (public)
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OTP sent if the email exists
 *       400:
 *         description: Validation failed
 */
router.post(
  '/password-reset/request',
  validate(requestPasswordResetSchema),
  userController.requestPasswordReset
);

/**
 * @swagger
 * /api/users/password-reset/verify:
 *   put:
 *     tags: [Users]
 *     summary: Verify OTP and set a new password (public)
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, newPassword]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid OTP
 */
router.put(
  '/password-reset/verify',
  validate(verifyPasswordResetSchema),
  userController.resetPassword
);

/**
 * @swagger
 * /api/users/change-email/request:
 *   post:
 *     tags: [Users]
 *     summary: Request email change
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Verification OTP/link sent
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/change-email/request',
  verifyToken,
  validate(changeEmailRequestSchema),
  userController.requestChangeEmail
);

/**
 * @swagger
 * /api/users/change-email/verify:
 *   put:
 *     tags: [Users]
 *     summary: Verify email change OTP
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email updated
 *       400:
 *         description: Invalid OTP
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/change-email/verify',
  verifyToken,
  validate(verifyChangeEmailSchema),
  userController.verifyChangeEmail
);

/**
 * @swagger
 * /api/users/change-phone/request:
 *   post:
 *     tags: [Users]
 *     summary: Request phone change (SMS OTP)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone]
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "09121234567"
 *     responses:
 *       200:
 *         description: SMS OTP sent
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/change-phone/request',
  verifyToken,
  validate(requestChangePhoneSchema),
  userController.requestChangePhone
);

/**
 * @swagger
 * /api/users/change-phone/verify:
 *   put:
 *     tags: [Users]
 *     summary: Verify phone change OTP
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, otp]
 *             properties:
 *               phone:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Phone updated
 *       400:
 *         description: Invalid OTP
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/change-phone/verify',
  verifyToken,
  validate(verifyChangePhoneSchema),
  userController.verifyChangePhone
);

// ==================== Admin Routes ====================

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: List all users (admin)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/', verifyToken, isAdmin, userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID (admin)
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
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 *   put:
 *     tags: [Users]
 *     summary: Update user by ID (admin)
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 *   delete:
 *     tags: [Users]
 *     summary: Delete or ban a user (admin)
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
 *         description: User deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
router.get(
  '/:id',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  userController.getUserById
);
router.put(
  '/:id',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  validate(updateProfileSchema),
  userController.updateUserById
);
router.delete(
  '/:id',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  userController.deleteUser
);

/**
 * @swagger
 * /api/users/{id}/role:
 *   put:
 *     tags: [Users]
 *     summary: Change user role (admin)
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
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: admin
 *     responses:
 *       200:
 *         description: Role updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
router.put(
  '/:id/role',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  validate(updateUserRoleSchema),
  userController.updateUserRole
);

module.exports = router;
