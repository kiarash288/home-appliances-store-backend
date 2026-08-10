const itemService = require('../services/item.service');

function getStatusCode(error) {
  const message = error.message || '';

  if (message.includes('not found')) {
    return 404;
  }

  return 500;
}

async function getAll(req, res) {
  try {
    const result = await itemService.getAllItems(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function getOne(req, res) {
  try {
    const item = await itemService.getItemById(req.params.id);
    return res.status(200).json(item);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function create(req, res) {
  try {
    const item = await itemService.createItem(req.body, req.user.id);
    return res.status(201).json(item);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const item = await itemService.updateItem(req.params.id, req.body);
    return res.status(200).json(item);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    const result = await itemService.deleteItem(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
