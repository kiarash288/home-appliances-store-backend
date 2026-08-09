const reviewService = require('../services/review.service');

function getStatusCode(error) {
  const message = error.message || '';

  if (message.includes('not found')) {
    return 404;
  }

  if (message.includes('already reviewed')) {
    return 409;
  }

  if (message.startsWith('Forbidden')) {
    return 403;
  }

  return 500;
}

async function createReview(req, res) {
  try {
    const review = await reviewService.createReview(
      req.user.id,
      req.params.itemId,
      req.body
    );
    return res.status(201).json(review);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function getProductReviews(req, res) {
  try {
    const reviews = await reviewService.getProductReviews(req.params.itemId);
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function deleteReview(req, res) {
  try {
    const result = await reviewService.deleteReview(
      req.user.id,
      req.params.reviewId
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

module.exports = {
  createReview,
  getProductReviews,
  deleteReview,
};
