const express = require('express');
const router = express.Router();

// ==================== Customer Routes ====================
// TODO: add verifyToken middleware (requires user to be logged in)
// Note: Admins do not manage active baskets

router.get('/', (req, res) => {}); // Get the logged-in user's active basket
router.post('/item', (req, res) => {}); // Add a new item to the basket (itemId, quantity)
router.put('/item/:itemId', (req, res) => {}); // Update quantity of a specific item
router.delete('/item/:itemId', (req, res) => {}); // Remove a specific item from the basket
router.delete('/', (req, res) => {}); // Clear the entire basket

module.exports = router;
