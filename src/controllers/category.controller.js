const categoryService = require('../services/category.service');

function getStatusCode(error) {
  const message = error.message || '';

  if (message.includes('not found')) {
    return 404;
  }

  if (message.includes('already exists')) {
    return 409;
  }

  if (
    message.includes('Cannot delete') ||
    message.includes('cannot be its own parent')
  ) {
    return 400;
  }

  return 500;
}

async function createCategory(req, res) {
  try {
    const category = await categoryService.createCategory(req.body);
    return res.status(201).json(category);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function getAllCategories(req, res) {
  try {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function getCategoryById(req, res) {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    return res.status(200).json(category);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function updateCategory(req, res) {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    return res.status(200).json(category);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function deleteCategory(req, res) {
  try {
    const result = await categoryService.deleteCategory(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
