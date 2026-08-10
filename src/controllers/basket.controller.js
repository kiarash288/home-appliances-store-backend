const basketService = require('../services/basket.service');

function getStatusCode(error) {
  const message = error.message || '';

  if (message.includes('not found')) {
    return 404;
  }

  if (message.includes('Insufficient stock')) {
    return 400;
  }

  return 500;
}

async function getBasket(req, res) {
  try {
    const basket = await basketService.getBasket(req.user.id);
    return res.status(200).json(basket);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function addItem(req, res) {
  try {
    const { productId, quantity } = req.body;
    const basket = await basketService.addItemToBasket(
      req.user.id,
      productId,
      quantity
    );
    return res.status(201).json(basket);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function updateQuantity(req, res) {
  try {
    const basket = await basketService.updateItemQuantity(
      req.user.id,
      req.params.itemId,
      req.body.quantity
    );
    return res.status(200).json(basket);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function removeItem(req, res) {
  try {
    const basket = await basketService.removeItemFromBasket(
      req.user.id,
      req.params.itemId
    );
    return res.status(200).json(basket);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function clearBasket(req, res) {
  try {
    const result = await basketService.clearBasket(req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

module.exports = {
  getBasket,
  addItem,
  updateQuantity,
  removeItem,
  clearBasket,
};
