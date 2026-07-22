const cartRepository = require('../repositories/cart.repository');

async function getCart(userId) {
  return cartRepository.findByUserId(userId);
}

async function addToCart(userId, data) {
  return cartRepository.create(userId, data);
}

async function updateCart(userId, data) {
  return cartRepository.update(userId, data);
}

async function clearCart(userId) {
  return cartRepository.remove(userId);
}

module.exports = {
  getCart,
  addToCart,
  updateCart,
  clearCart,
};
