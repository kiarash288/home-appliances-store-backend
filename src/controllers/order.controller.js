const orderService = require('../services/order.service');

function getStatusCode(error) {
  const message = error.message || '';

  if (message.includes('not found')) {
    return 404;
  }

  if (
    message.includes('empty') ||
    message.includes('Insufficient stock') ||
    message.includes('unauthorized')
  ) {
    return 400;
  }

  return 500;
}

async function create(req, res) {
  try {
    const order = await orderService.createOrder(
      req.user.id,
      req.body.addressId
    );
    return res.status(201).json(order);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function getAll(req, res) {
  try {
    const orders = await orderService.getUserOrders(req.user.id);
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function getOne(req, res) {
  try {
    const order = await orderService.getOrderById(req.user.id, req.params.id);
    return res.status(200).json(order);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function updateStatus(req, res) {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status
    );
    return res.status(200).json(order);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

module.exports = {
  create,
  getAll,
  getOne,
  updateStatus,
};
