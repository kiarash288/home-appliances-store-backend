const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/auth.middleware');
const { validateParams } = require('../middlewares/validate.middleware');
const { createParamIdSchema } = require('../validators/common.validator');
const paymentController = require('../controllers/payment.controller');

// ==================== Payment Flow (ZarinPal) ====================

// Public — ZarinPal redirects here with ?Authority=&Status= (GET).
// Registered before param routes so "callback" is never treated as an orderId.
router.get('/callback', paymentController.verifyCallback);

router.post(
  '/:orderId/init',
  verifyToken,
  validateParams(createParamIdSchema('orderId')),
  paymentController.initiate
);

module.exports = router;
