const express = require('express');
const router = express.Router();

// ==================== Customer/Payment Flow Routes ====================

// TODO: add verifyToken middleware
router.post('/request/:orderId', (req, res) => {}); // Initiate payment for an order

// Publicly accessible - payment gateway callback
router.get('/verify', (req, res) => {}); // Verify transaction after gateway redirect

// TODO: add verifyToken middleware
router.get('/me', (req, res) => {}); // Get payment history for logged-in user

// ==================== Admin Routes ====================
// TODO: add verifyToken, isAdmin middlewares

router.get('/', (req, res) => {}); // Get all payments
router.get('/:id', (req, res) => {}); // Get payment details by ID

module.exports = router;
