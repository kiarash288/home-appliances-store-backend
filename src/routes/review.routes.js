const express = require('express');
const router = express.Router();

const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { validateParams } = require('../middlewares/validate.middleware');
const { createParamIdSchema } = require('../validators/common.validator');
const {
  createReviewSchema,
  updateReviewSchema,
  updateReviewStatusSchema,
} = require('../validators/review.validator');
const reviewController = require('../controllers/review.controller');

// ==================== Public Routes ====================

/**
 * @swagger
 * /api/reviews/item/{itemId}:
 *   get:
 *     tags: [Reviews]
 *     summary: List approved reviews for a product
 *     security: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Approved reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *   post:
 *     tags: [Reviews]
 *     summary: Create a review for a product
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating]
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Excellent quality and fast shipping.
 *     responses:
 *       201:
 *         description: Review created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.get(
  '/item/:itemId',
  validateParams(createParamIdSchema('itemId')),
  reviewController.getProductReviews
);
router.post(
  '/item/:itemId',
  verifyToken,
  validateParams(createParamIdSchema('itemId')),
  validate(createReviewSchema),
  reviewController.createReview
);

/**
 * @swagger
 * /api/reviews/my-reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: List reviews written by the logged-in user
 *     description: Handler may be a stub pending full implementation.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized
 */
router.get('/my-reviews', verifyToken, (req, res) => {});

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: List all reviews (admin)
 *     description: Optional filter by approval status via query. Handler may be a stub.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isApproved
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: All reviews
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/', verifyToken, isAdmin, (req, res) => {});

/**
 * @swagger
 * /api/reviews/admin/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Force-delete any review (admin)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Review deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Review not found
 */
router.delete(
  '/admin/:id',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  (req, res) => {}
);

/**
 * @swagger
 * /api/reviews/{reviewId}:
 *   put:
 *     tags: [Reviews]
 *     summary: Update own review
 *     description: Handler may be a stub pending full implementation.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete own review
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Review deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */
router.put(
  '/:reviewId',
  verifyToken,
  validateParams(createParamIdSchema('reviewId')),
  validate(updateReviewSchema),
  (req, res) => {}
);
router.delete(
  '/:reviewId',
  verifyToken,
  validateParams(createParamIdSchema('reviewId')),
  reviewController.deleteReview
);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get review by ID (admin)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Review details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Review not found
 */
router.get(
  '/:id',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  (req, res) => {}
);

/**
 * @swagger
 * /api/reviews/{id}/status:
 *   put:
 *     tags: [Reviews]
 *     summary: Approve or reject a review (admin)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isApproved]
 *             properties:
 *               isApproved:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Review moderation status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Review not found
 */
router.put(
  '/:id/status',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  validate(updateReviewStatusSchema),
  (req, res) => {}
);

module.exports = router;
