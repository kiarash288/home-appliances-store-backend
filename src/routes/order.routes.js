const express = require('express');
const router = express.Router();

// ==================== Customer Routes ====================
// TODO: add verifyToken middleware
// Note: Customers cannot freely UPDATE or DELETE an order (financial document)

router.post('/', (req, res) => {}); // Create a new order (from current basket)
router.get('/', (req, res) => {}); // Get order history for logged-in user

// ==================== Admin Routes ====================
// TODO: add verifyToken, isAdmin middlewares
// Registered before /:id so "admin" is not captured as an id param

router.get('/admin', (req, res) => {}); // Get all orders across the platform
router.get('/admin/tracking/:trackingCode', (req, res) => {}); // Find order by tracking code
router.get('/admin/:id', (req, res) => {}); // Get full details of any specific order
router.put('/admin/:id/status', (req, res) => {}); // Update order status
router.delete('/admin/:id', (req, res) => {}); // Soft delete or archive an order

// ==================== Customer Routes (by id) ====================
// TODO: add verifyToken middleware

router.get('/:id', (req, res) => {}); // Get full details/receipt of a specific order
// router.put('/:id/cancel', (req, res) => {}); // Cancel an order (if not yet shipped)

module.exports = router;
