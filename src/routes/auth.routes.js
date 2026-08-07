const express = require('express');
const router = express.Router();

// ==================== Public Routes ====================
// No authentication required

router.post('/register', (req, res) => {}); // Register a new user
router.post('/login', (req, res) => {}); // Login and return Access/Refresh tokens
router.post('/refresh-token', (req, res) => {}); // Issue a new Access Token from Refresh Token

// ==================== Protected Routes ====================
// TODO: add verifyToken middleware

router.post('/logout', (req, res) => {}); // Logout and invalidate session/refresh token

module.exports = router;
