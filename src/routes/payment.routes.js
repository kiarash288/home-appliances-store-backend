const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/auth.middleware');
const { validateParams } = require('../middlewares/validate.middleware');
const { createParamIdSchema } = require('../validators/common.validator');
const paymentController = require('../controllers/payment.controller');

// ==================== Payment Flow (ZarinPal) ====================

/**
 * @swagger
 * /api/payments/callback:
 *   get:
 *     tags: [Payments]
 *     summary: ZarinPal payment callback (public)
 *     description: |
 *       Public endpoint hit by ZarinPal after checkout. No Bearer token required.
 *       Verifies payment when Status=OK and updates Payment/Order inside a transaction.
 *     security: []
 *     parameters:
 *       - in: query
 *         name: Authority
 *         required: true
 *         schema:
 *           type: string
 *         example: A000000000000000000000000000000000000
 *       - in: query
 *         name: Status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [OK, NOK]
 *         example: OK
 *     responses:
 *       200:
 *         description: Payment verified (JSON when FRONTEND_URL is unset)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *                 refId:
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: success
 *       302:
 *         description: Redirect to frontend success/failure page when FRONTEND_URL is set
 *       400:
 *         description: Canceled, already processed, or verification failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/callback', paymentController.verifyCallback);

/**
 * @swagger
 * /api/payments/{orderId}/init:
 *   post:
 *     tags: [Payments]
 *     summary: Initiate ZarinPal payment for an order
 *     description: Creates a pending Payment and returns the ZarinPal redirect URL.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 4
 *     responses:
 *       201:
 *         description: Payment initiated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentInitResponse'
 *       400:
 *         description: Order not payable or ZarinPal error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/:orderId/init',
  verifyToken,
  validateParams(createParamIdSchema('orderId')),
  paymentController.initiate
);

module.exports = router;
