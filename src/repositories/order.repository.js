const { Order, OrderItem, Item, Address, Payment, User } = require('../models');

async function create(orderData, options = {}) {
  return Order.create(orderData, options);
}

async function bulkCreateOrderItems(items, options = {}) {
  return OrderItem.bulkCreate(items, options);
}

async function findById(orderId, options = {}) {
  return Order.findByPk(orderId, options);
}

const USER_SAFE_ATTRIBUTES = ['id', 'firstName', 'lastName', 'email', 'phone'];

async function getAll(queryFilters = {}) {
  const where = {};

  if (queryFilters.status) {
    where.status = queryFilters.status;
  }

  if (queryFilters.tracking_code) {
    where.tracking_code = queryFilters.tracking_code;
  }

  return Order.findAll({
    where,
    include: [
      {
        model: User,
        as: 'user',
        attributes: USER_SAFE_ATTRIBUTES,
      },
      {
        model: OrderItem,
        as: 'orderItems',
        include: [
          {
            model: Item,
            as: 'item',
            attributes: ['id', 'name', 'main_image'],
          },
        ],
      },
    ],
    order: [['createdAt', 'DESC']],
  });
}

async function getOrderDetailsById(orderId) {
  return Order.findOne({
    where: { id: orderId },
    include: [
      {
        model: User,
        as: 'user',
        attributes: USER_SAFE_ATTRIBUTES,
      },
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

async function getUserOrders(userId) {
  return Order.findAll({
    where: { user_id: userId },
    include: [
      {
        model: OrderItem,
        as: 'orderItems',
        include: [
          {
            model: Item,
            as: 'item',
            attributes: ['id', 'name', 'main_image'],
          },
        ],
      },
    ],
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

async function updateStatus(orderId, status, options = {}) {
  const order = await Order.findByPk(orderId, options);
  if (!order) {
    return null;
  }
  return order.update({ status }, options);
}

async function deleteById(orderId) {
  return Order.destroy({ where: { id: orderId } });
}

module.exports = {
  create,
  bulkCreateOrderItems,
  findById,
  getAll,
  getUserOrders,
  getOrderWithDetails,
  getOrderDetailsById,
  updateStatus,
  deleteById,
};
