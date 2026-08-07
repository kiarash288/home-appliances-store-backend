const express = require('express');
const router = express.Router();

// ==================== Customer Routes ====================
// TODO: add verifyToken middleware

router.get('/profile', (req, res) => {}); // Get logged-in user's profile
router.put('/profile', (req, res) => {}); // Update logged-in user's profile
router.put('/change-password', (req, res) => {}); // Change logged-in user's password
router.put('/change-password/verify', (req, res) => {}); // Confirm new password
router.post('/change-email/request', (req, res) => {}); // Request email change (OTP/link)
router.put('/change-email/verify', (req, res) => {}); // Verify OTP and update email
router.post('/change-phone/request', (req, res) => {}); // Request phone change (SMS OTP)
router.put('/change-phone/verify', (req, res) => {}); // Verify SMS OTP and update phone
router.get('/favorites', (req, res) => {}); // Get logged-in user's favorites
// router.get('/sessions', (req, res) => {}); // Get active sessions for logged-in user

// ==================== Admin Routes ====================
// TODO: add verifyToken, isAdmin middlewares

router.get('/', (req, res) => {}); // Get list of all users
router.get('/:id', (req, res) => {}); // Get user details by ID
router.put('/:id', (req, res) => {}); // Update user by ID
router.put('/:id/role', (req, res) => {}); // Change user role
router.delete('/:id', (req, res) => {}); // Delete or ban a user

module.exports = router;
