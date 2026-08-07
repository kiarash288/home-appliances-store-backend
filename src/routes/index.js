const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const categoryRoutes = require('./category.routes');
const itemRoutes = require('./item.routes');
const basketRoutes = require('./basket.routes');
const orderRoutes = require('./order.routes');
const paymentRoutes = require('./payment.routes');
const addressRoutes = require('./address.routes');
const reviewRoutes = require('./review.routes');
const favoriteRoutes = require('./favorite.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/items', itemRoutes);
router.use('/baskets', basketRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/addresses', addressRoutes);
router.use('/reviews', reviewRoutes);
router.use('/favorites', favoriteRoutes);

module.exports = router;
