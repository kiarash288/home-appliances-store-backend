const { Basket, BasketItem, Item } = require('../models');

async function createBasket(userId) {
  return Basket.create({ user_id: userId });
}

async function getBasketWithItems(userId) {
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
          },
        ],
      },
    ],
    order: [['createdAt', 'DESC']],
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

async function clearBasket(basketId) {
  return BasketItem.destroy({
    where: { basket_id: basketId },
  });
}

module.exports = {
  createBasket,
  getBasketWithItems,
  checkItemInBasket,
  addItem,
  updateItemQuantity,
  removeItem,
  clearBasket,
};
