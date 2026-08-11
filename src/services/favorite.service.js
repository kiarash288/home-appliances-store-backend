const favoriteRepository = require('../repositories/favorite.repository');
const itemRepository = require('../repositories/item.repository');

async function getUserFavorites(userId) {
  return favoriteRepository.getUserFavorites(userId);
}

async function addFavorite(userId, itemId) {
  const item = await itemRepository.findById(itemId);
  if (!item) {
    throw new Error('Item not found');
  }

  const existing = await favoriteRepository.checkIfExists(userId, itemId);
  if (existing) {
    throw new Error('Item is already in favorites');
  }

  return favoriteRepository.create({
    user_id: userId,
    item_id: itemId,
  });
}

async function removeFavorite(userId, itemId) {
  const existing = await favoriteRepository.checkIfExists(userId, itemId);
  if (!existing) {
    throw new Error('Favorite not found');
  }

  await favoriteRepository.removeByUserAndItem(userId, itemId);
  return { message: 'Favorite removed successfully' };
}

module.exports = {
  getUserFavorites,
  addFavorite,
  removeFavorite,
};
