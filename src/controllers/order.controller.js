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

// ==================== Admin ====================

async function getAllAsAdmin(req, res) {
  try {
    const filters = {};
    if (req.query.status) {
      filters.status = String(req.query.status).toLowerCase();
    }
    const orders = await orderService.getAllOrders(filters);
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function getOneAsAdmin(req, res) {
  try {
    const order = await orderService.getOrderByIdAsAdmin(req.params.id);
    return res.status(200).json(order);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function getByTrackingCode(req, res) {
  try {
    const order = await orderService.getOrderByTrackingCode(
      req.params.trackingCode
    );
    return res.status(200).json(order);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function removeAsAdmin(req, res) {
  try {
    const result = await orderService.deleteOrder(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

module.exports = {
  create,
  getAll,
  getOne,
  updateStatus,
  getAllAsAdmin,
  getOneAsAdmin,
  getByTrackingCode,
  removeAsAdmin,
};
