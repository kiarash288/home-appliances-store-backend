const { Review, User, Item } = require('../models');

async function create(reviewData) {
  return Review.create(reviewData);
}

async function getAll() {
  return Review.findAll();
}

async function approveReview(id) {
  return Review.update({ is_approved: true }, { where: { id: id } });
}

async function rejectReview(id) {
  return Review.update({ is_approved: false }, { where: { id: id } });
}

async function findById(id) {
  return Review.findByPk(id);
}

async function deleteById(id) {
  return Review.destroy({ where: { id } });
}

async function getReviewByDetails(id) {
  return Review.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: User,
      },
      {
        model: Item,
        as: 'item',
      },
    ],
  });
}

async function updateById(id, updateData) {
  const review = await Review.findByPk(id);
  if (!review) {
    return null;
  }
  return review.update(updateData);
}

async function getItemReviews(itemId) {
  return Review.findAll({
    where: { item_id: itemId },
    include: [
      {
        model: User,
        as: 'user',
      },
    ],
  });
}

async function getUserReviews(userId) {
  return Review.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Item,
        as: 'item',
      },
    ],
  });
}

async function updateByUserAndReviewId(userId, reviewId, updateData) {
  const review = await Review.findOne({
    where: {
      id: reviewId,
      user_id: userId,
    },
  });
  if (!review) {
    return null;
  }
  return review.update(updateData);
}

async function deleteByUserAndReviewId(userId, reviewId) {
  return Review.destroy({
    where: {
      id: reviewId,
      user_id: userId,
    },
  });
}

async function checkIfUserReviewedItem(userId, itemId) {
  return Review.findOne({
    where: {
      user_id: userId,
      item_id: itemId,
    },
  });
}

module.exports = {
  create,
  getAll,
  getItemReviews,
  getUserReviews,
  updateByUserAndReviewId,
  deleteByUserAndReviewId,
  checkIfUserReviewedItem,
};
