const { Payment, Order, User } = require('../models');

async function create(paymentData) {
  return Payment.create(paymentData);
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

async function findById(id) {
  return Payment.findByPk(id);
}

async function deleteById(id) {
  return Payment.destroy({ where: { id } });
}


async function updateById(id, updateData) {
  const payment = await Payment.findByPk(id);
  if (!payment) {
    return null;
  }
  return payment.update(updateData);
}

async function findByAuthority(authority) {
  return Payment.findOne({
    where: { tracking_code: authority },
  });
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
  findByAuthority,
  updateById,
  getUserPayments,
  getAll,
};
