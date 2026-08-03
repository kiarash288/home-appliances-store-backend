const { Favorite, Item } = require('../models');

async function create(favoriteData) {
  return Favorite.create(favoriteData);
}

async function findById(id) {
  return Favorite.findByPk(id);
}

async function deleteById(id) {
  return Favorite.destroy({ where: { id } });
}

async function updateById(id, updateData) {
  const favorite = await Favorite.findByPk(id);
  if (!favorite) {
    return null;
  }
  return favorite.update(updateData);
}

async function getUserFavorites(userId) {
  return Favorite.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Item,
        as: 'item',
      },
    ],
  });
}

async function removeByUserAndItem(userId, itemId) {
  return Favorite.destroy({
    where: {
      user_id: userId,
      item_id: itemId,
    },
  });
}
// for toggle favorite and decide waether use remove or create
async function checkIfExists(userId, itemId) { 
  return Favorite.findOne({
    where: {
      user_id: userId,
      item_id: itemId,
    },
  });
}

module.exports = {
  create,
  getUserFavorites,
  removeByUserAndItem,
  checkIfExists,
};
