const favoriteService = require('../services/favorite.service');

function getStatusCode(error) {
  const message = error.message || '';

  if (message.includes('not found')) {
    return 404;
  }

  if (message.includes('already in favorites')) {
    return 409;
  }

  return 500;
}

async function getFavorites(req, res) {
  try {
    const favorites = await favoriteService.getUserFavorites(req.user.id);
    return res.status(200).json(favorites);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function add(req, res) {
  try {
    const favorite = await favoriteService.addFavorite(
      req.user.id,
      req.params.itemId
    );
    return res.status(201).json(favorite);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    const result = await favoriteService.removeFavorite(
      req.user.id,
      req.params.itemId
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

module.exports = {
  getFavorites,
  add,
  remove,
};
