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
// No authentication required

router.get(
  '/item/:itemId',
  validateParams(createParamIdSchema('itemId')),
  reviewController.getProductReviews
); // Get all approved reviews for an item

// ==================== Customer/User Routes ====================

router.post(
  '/item/:itemId',
  verifyToken,
  validateParams(createParamIdSchema('itemId')),
  validate(createReviewSchema),
  reviewController.createReview
); // Create a new review for an item
router.get('/my-reviews', verifyToken, (req, res) => {}); // Get reviews written by logged-in user
router.put(
  '/:reviewId',
  verifyToken,
  validateParams(createParamIdSchema('reviewId')),
  validate(updateReviewSchema),
  (req, res) => {}
); // Update own review
router.delete(
  '/:reviewId',
  verifyToken,
  validateParams(createParamIdSchema('reviewId')),
  reviewController.deleteReview
); // Delete own review

// ==================== Admin Routes ====================

router.get('/', verifyToken, isAdmin, (req, res) => {}); // Get all reviews (filter by status via query)
router.get(
  '/:id',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  (req, res) => {}
); // Get review details by ID
router.put(
  '/:id/status',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  validate(updateReviewStatusSchema),
  (req, res) => {}
); // Approve or reject a review
router.delete(
  '/admin/:id',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  (req, res) => {}
); // Force delete any review

module.exports = router;
