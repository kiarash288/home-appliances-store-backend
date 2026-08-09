const reviewRepository = require('../repositories/review.repository');
const itemRepository = require('../repositories/item.repository');

async function createReview(userId, productId, reviewData) {
  const product = await itemRepository.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  const existingReview = await reviewRepository.checkIfUserReviewedItem(userId, productId);
  if (existingReview) {
    throw new Error('You have already reviewed this product');
  }

  return reviewRepository.create({
    user_id: userId,
    item_id: productId,
    rating: reviewData.rating,
    comment: reviewData.comment,
  });
}

async function getProductReviews(productId) {
  const product = await itemRepository.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  return reviewRepository.getItemReviews(productId);
}

async function deleteReview(userId, reviewId) {
  const review = await reviewRepository.findById(reviewId);
  if (!review) {
    throw new Error('Review not found');
  }

  if (Number(review.user_id) !== Number(userId)) {
    throw new Error('Forbidden: you can only delete your own reviews');
  }

  await reviewRepository.deleteById(reviewId);
  return { message: 'Review deleted successfully' };
}

module.exports = {
  createReview,
  getProductReviews,
  deleteReview,
};
