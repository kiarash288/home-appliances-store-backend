const express = require('express');
const router = express.Router();

// ==================== Public Routes ====================
// No authentication required

router.get('/item/:itemId', (req, res) => {}); // Get all approved reviews for an item

// ==================== Customer/User Routes ====================
// TODO: add verifyToken middleware

router.post('/item/:itemId', (req, res) => {}); // Create a new review for an item
router.get('/my-reviews', (req, res) => {}); // Get reviews written by logged-in user
router.put('/:id', (req, res) => {}); // Update own review
router.delete('/:id', (req, res) => {}); // Delete own review
// router.post('/:id/helpful', (req, res) => {}); // Vote review as helpful

// ==================== Admin Routes ====================
// TODO: add verifyToken, isAdmin middlewares

router.get('/', (req, res) => {}); // Get all reviews (filter by status via query)
router.get('/:id', (req, res) => {}); // Get review details by ID
router.put('/:id/status', (req, res) => {}); // Approve or reject a review
router.delete('/admin/:id', (req, res) => {}); // Force delete any review

module.exports = router;
