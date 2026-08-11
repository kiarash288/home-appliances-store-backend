const { Payment, Order, User } = require('../models');

async function create(paymentData, options = {}) {
  return Payment.create(paymentData, options);
}

async function getAll() {
  return Payment.findAll({
    include: [
      {
        model: Order,
        as: 'order',
        include: [
          {
            model: User,
            as: 'user',
          },
        ],
      },
    ],
  });
}

async function findById(id, options = {}) {
  return Payment.findByPk(id, options);
}

async function deleteById(id) {
  return Payment.destroy({ where: { id } });
}

async function updateById(id, updateData, options = {}) {
  const payment = await Payment.findByPk(id, options);
  if (!payment) {
    return null;
  }
  return payment.update(updateData, options);
}

/**
 * Finds a payment by its gateway transaction / authority code.
 * Stored in the `tracking_code` column.
 */
async function findByTransactionId(transactionId, options = {}) {
  return Payment.findOne({
    where: { tracking_code: transactionId },
    ...options,
  });
}

async function findByAuthority(authority, options = {}) {
  return findByTransactionId(authority, options);
}

async function getUserPayments(userId) {
  return Payment.findAll({
    include: [
      {
        model: Order,
        as: 'order',
        where: { user_id: userId },
        required: true,
      },
    ],
  });
}

module.exports = {
  create,
  findById,
  findByAuthority,
  findByTransactionId,
  updateById,
  deleteById,
  getUserPayments,
  getAll,
};
