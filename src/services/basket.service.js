const basketRepository = require('../repositories/basket.repository');
const itemRepository = require('../repositories/item.repository');

function calculateTotal(basketItems = []) {
  return basketItems.reduce((sum, basketItem) => {
    const price = Number(basketItem.item?.price || 0);
    const quantity = Number(basketItem.quantity || 0);
    return sum + price * quantity;
  }, 0);
}

function formatBasket(basket) {
  if (!basket) {
    return {
      id: null,
      items: [],
      totalPrice: 0,
    };
  }

  const data = typeof basket.toJSON === 'function' ? basket.toJSON() : basket;
  const items = data.basketItems || [];

  return {
    id: data.id,
    items,
    totalPrice: Number(calculateTotal(items).toFixed(2)),
  };
}

async function getOrCreateBasket(userId) {
  let basket = await basketRepository.findBasketByUserId(userId);
  if (!basket) {
    basket = await basketRepository.createBasket(userId);
  }
  return basket;
}

async function getBasket(userId) {
  const basket = await basketRepository.getBasketWithItems(userId);
  return formatBasket(basket);
}

async function addItemToBasket(userId, productId, quantity) {
  const product = await itemRepository.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  if (Number(product.stock) < Number(quantity)) {
    throw new Error('Insufficient stock for this product');
  }

  const basket = await getOrCreateBasket(userId);
  const existingItem = await basketRepository.checkItemInBasket(
    basket.id,
    productId
  );

  if (existingItem) {
    const newQuantity = Number(existingItem.quantity) + Number(quantity);
    if (Number(product.stock) < newQuantity) {
      throw new Error('Insufficient stock for this product');
    }
    await basketRepository.updateItemQuantity(basket.id, productId, newQuantity);
  } else {
    await basketRepository.addItem(basket.id, productId, quantity);
  }

  return getBasket(userId);
}

async function updateItemQuantity(userId, itemId, quantity) {
  const basket = await basketRepository.findBasketByUserId(userId);
  if (!basket) {
    throw new Error('Basket not found');
  }

  const existingItem = await basketRepository.checkItemInBasket(
    basket.id,
    itemId
  );
  if (!existingItem) {
    throw new Error('Item not found in basket');
  }

  if (Number(quantity) <= 0) {
    await basketRepository.removeItem(basket.id, itemId);
    return getBasket(userId);
  }

  const product = await itemRepository.findById(itemId);
  if (!product) {
    throw new Error('Product not found');
  }

  if (Number(product.stock) < Number(quantity)) {
    throw new Error('Insufficient stock for this product');
  }

  await basketRepository.updateItemQuantity(basket.id, itemId, quantity);
  return getBasket(userId);
}

async function removeItemFromBasket(userId, itemId) {
  const basket = await basketRepository.findBasketByUserId(userId);
  if (!basket) {
    throw new Error('Basket not found');
  }

  const existingItem = await basketRepository.checkItemInBasket(
    basket.id,
    itemId
  );
  if (!existingItem) {
    throw new Error('Item not found in basket');
  }

  await basketRepository.removeItem(basket.id, itemId);
  return getBasket(userId);
}

async function clearBasket(userId) {
  const basket = await basketRepository.findBasketByUserId(userId);
  if (!basket) {
    return { message: 'Basket cleared successfully', basket: formatBasket(null) };
  }

  await basketRepository.clearBasket(basket.id);
  return {
    message: 'Basket cleared successfully',
    basket: formatBasket(await basketRepository.getBasketWithItems(userId)),
  };
}

module.exports = {
  getBasket,
  addItemToBasket,
  updateItemQuantity,
  removeItemFromBasket,
  clearBasket,
};
