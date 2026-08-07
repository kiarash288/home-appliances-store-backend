const express = require('express');
const router = express.Router();

// ==================== Public Routes ====================
// No authentication required

router.get('/', (req, res) => {}); // Get all items (search, filter, sort, pagination via query)
router.get('/:id', (req, res) => {}); // Get full item details by ID

// ==================== Customer Routes ====================
// TODO: add verifyToken middleware

router.post('/:id/favorite', (req, res) => {}); // Add item to favorites
router.delete('/:id/favorite', (req, res) => {}); // Remove item from favorites

// ==================== Admin Routes ====================
// TODO: add verifyToken, isAdmin middlewares

router.post('/', (req, res) => {}); // Create a new item
router.put('/:id', (req, res) => {}); // Update item details
router.delete('/:id', (req, res) => {}); // Delete an item


module.exports = router;
