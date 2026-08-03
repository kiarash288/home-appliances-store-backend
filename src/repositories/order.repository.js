const { Order, OrderItem, Item, Address, Payment, User } = require('../models');

async function create(orderData) {
  return Order.create(orderData);
}

async function getAll(queryFilters = {}) {
  const where = {};

  if (queryFilters.status) {
    where.status = queryFilters.status;
    order.push(['createdAt', 'DESC']);
  }


  if (queryFilters.tracking_code) {
    where.tracking_code = queryFilters.tracking_code;
    order.push(['createdAt', 'DESC']);
  }
  
  return Order.findAll({
    where,
    include: [
      {
        model: User,
        as: 'user',
      },
    ],
    order: [['createdAt', 'DESC']],
  });
}

async function getUserOrders(userId) {
  return Order.findAll({
    where: { user_id: userId },
    order: [['createdAt', 'DESC']],
  });
}

async function getOrderWithDetails(orderId, userId) {
  return Order.findOne({
    where: {
      id: orderId,
      user_id: userId,
    },
    include: [
      {
        model: OrderItem,
        as: 'orderItems',
        include: [
          {
            model: Item,
            as: 'item',
          },
        ],
      },
      {
        model: Address,
        as: 'address',
      },
      {
        model: Payment,
        as: 'payments',
      },
    ],
  });
}

async function updateStatus(orderId, status) {
  const order = await Order.findByPk(orderId);
  if (!order) {
    return null;
  }
  return order.update({ status });
}

async function deleteById(orderId) {
  return Order.destroy({ where: { id: orderId } });
}

module.exports = {
  create,
  getAll,
  getUserOrders,
  getOrderWithDetails,
  updateStatus,
  deleteById,
};
