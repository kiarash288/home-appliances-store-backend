const crypto = require('crypto');
const { sequelize, Item } = require('../models');
const orderRepository = require('../repositories/order.repository');
const basketRepository = require('../repositories/basket.repository');
const itemRepository = require('../repositories/item.repository');
const addressRepository = require('../repositories/address.repository');

function generateTrackingCode(userId) {
  const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `ORD-${Date.now()}-${userId}-${suffix}`;
}

async function createOrder(userId, addressId) {
  const transaction = await sequelize.transaction();

  try {
    const basket = await basketRepository.getBasketWithItems(userId, {
      transaction,
    });

    if (!basket || !basket.basketItems || basket.basketItems.length === 0) {
      throw new Error('Basket is empty');
    }

    if (addressId) {
      const address = await addressRepository.findById(addressId);
      if (!address || Number(address.userId ?? address.user_id) !== Number(userId)) {
        throw new Error('Address not found or unauthorized');
      }
    }

    let totalAmount = 0;
    const orderItemsPayload = [];

    for (const basketItem of basket.basketItems) {
      const product = await Item.findByPk(basketItem.item_id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!product) {
        throw new Error(`Product not found: ${basketItem.item_id}`);
      }

      if (Number(product.stock) < Number(basketItem.quantity)) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      const unitPrice = Number(product.price);
      const quantity = Number(basketItem.quantity);
      totalAmount += unitPrice * quantity;

      orderItemsPayload.push({
        item_id: product.id,
        quantity,
        unit_price: unitPrice,
      });
    }

    const order = await orderRepository.create(
      {
        user_id: userId,
        address_id: addressId || null,
        total_amount: Number(totalAmount.toFixed(2)),
        status: 'pending',
        tracking_code: generateTrackingCode(userId),
      },
      { transaction }
    );

    await orderRepository.bulkCreateOrderItems(
      orderItemsPayload.map((item) => ({
        ...item,
        order_id: order.id,
      })),
      { transaction }
    );

    for (const line of orderItemsPayload) {
      await itemRepository.decreaseStock(line.item_id, line.quantity, {
        transaction,
      });
    }

    await basketRepository.clearBasket(basket.id, { transaction });

    await transaction.commit();

    return orderRepository.getOrderWithDetails(order.id, userId);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function getUserOrders(userId) {
  return orderRepository.getUserOrders(userId);
}

async function getOrderById(userId, orderId) {
  const order = await orderRepository.getOrderWithDetails(orderId, userId);
  if (!order) {
    throw new Error('Order not found');
  }
  return order;
}

async function updateOrderStatus(orderId, status) {
  const order = await orderRepository.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  return orderRepository.updateStatus(orderId, status);
}

// ==================== Admin ====================

async function getAllOrders(filters = {}) {
  return orderRepository.getAll(filters);
}

async function getOrderByIdAsAdmin(orderId) {
  const order = await orderRepository.getOrderDetailsById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }
  return order;
}

async function getOrderByTrackingCode(trackingCode) {
  const orders = await orderRepository.getAll({ tracking_code: trackingCode });
  if (!orders.length) {
    throw new Error('Order not found');
  }
  return orders[0];
}

async function deleteOrder(orderId) {
  const order = await orderRepository.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  await orderRepository.deleteById(orderId);
  return { message: 'Order deleted successfully' };
}

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getOrderByIdAsAdmin,
  getOrderByTrackingCode,
  deleteOrder,
};
