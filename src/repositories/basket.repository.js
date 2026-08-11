const { Basket, BasketItem, Item } = require('../models');

async function createBasket(userId) {
  return Basket.create({ user_id: userId });
}

async function findBasketByUserId(userId) {
  return Basket.findOne({
    where: { user_id: userId },
    order: [['createdAt', 'DESC']],
  });
}

async function getBasketWithItems(userId, options = {}) {
  return Basket.findOne({
    where: { user_id: userId },
    include: [
      {
        model: BasketItem,
        as: 'basketItems',
        include: [
          {
            model: Item,
            as: 'item',
            attributes: ['id', 'name', 'price', 'main_image', 'stock'],
          },
        ],
      },
    ],
    order: [['createdAt', 'DESC']],
    ...options,
  });
}

async function checkItemInBasket(basketId, itemId) {
  return BasketItem.findOne({
    where: {
      basket_id: basketId,
      item_id: itemId,
    },
  });
}

async function addItem(basketId, itemId, quantity) {
  return BasketItem.create({
    basket_id: basketId,
    item_id: itemId,
    quantity,
  });
}

async function updateItemQuantity(basketId, itemId, quantity) {
  const basketItem = await BasketItem.findOne({
    where: {
      basket_id: basketId,
      item_id: itemId,
    },
  });
  if (!basketItem) {
    return null;
  }
  return basketItem.update({ quantity });
}

async function removeItem(basketId, itemId) {
  return BasketItem.destroy({
    where: {
      basket_id: basketId,
      item_id: itemId,
    },
  });
}

async function clearBasket(basketId, options = {}) {
  return BasketItem.destroy({
    where: { basket_id: basketId },
    ...options,
  });
}

module.exports = {
  createBasket,
  findBasketByUserId,
  getBasketWithItems,
  checkItemInBasket,
  addItem,
  updateItemQuantity,
  removeItem,
  clearBasket,
};
