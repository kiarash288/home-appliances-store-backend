const express = require('express');
const router = express.Router();

// ==================== Public Routes ====================
// No authentication required

router.get('/', (req, res) => {}); // Get all categories
router.get('/:id', (req, res) => {}); // Get category details by ID

// ==================== Admin Routes ====================
// TODO: add verifyToken, isAdmin middlewares

router.post('/main', (req, res) => {}); // Create a new category
router.post('/sub', (req, res) => {}); // Create a new sub category
router.put('/:id', (req, res) => {}); // Update a category
router.delete('/:id', (req, res) => {}); // Delete a category

module.exports = router;
