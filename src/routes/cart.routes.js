const express = require('express');
const cartController = require('../controllers');
const validateCart = require('../validators/cart.validator');

const router = express.Router();

router.get('/:userId', validateCart.getCart, cartController.getCart);
router.post('/:userId', validateCart.addToCart, cartController.addToCart);
router.put('/:userId', validateCart.updateCart, cartController.updateCart);
router.delete('/:userId', validateCart.clearCart, cartController.clearCart);

module.exports = router;
