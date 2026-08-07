const express = require('express');
const router = express.Router();

// ==================== Customer Routes ====================
// TODO: add verifyToken middleware

router.get('/', (req, res) => {}); // Get all addresses for logged-in user
router.post('/', (req, res) => {}); // Add a new address
router.put('/:id', (req, res) => {}); // Update user's specific address
router.delete('/:id', (req, res) => {}); // Delete user's specific address
router.put('/:id/default', (req, res) => {}); // Set address as default

// ==================== Admin Routes ====================
// TODO: add verifyToken, isAdmin middlewares

router.get('/user/:userId', (req, res) => {}); // Get all addresses of a specific user
router.put('/admin/:id', (req, res) => {}); // Update any address (support)
router.delete('/admin/:id', (req, res) => {}); // Delete a problematic address

module.exports = router;
