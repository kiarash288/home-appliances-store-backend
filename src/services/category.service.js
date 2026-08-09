const categoryRepository = require('../repositories/category.repository');

async function createCategory(data) {
  const existing = await categoryRepository.findByName(data.name);
  if (existing) {
    throw new Error('Category name already exists');
  }

  if (data.parentId) {
    const parent = await categoryRepository.findById(data.parentId);
    if (!parent) {
      throw new Error('Parent category not found');
    }
  }

  return categoryRepository.create(data);
}

async function getAllCategories() {
  return categoryRepository.getAll();
}

async function getCategoryById(categoryId) {
  const category = await categoryRepository.findById(categoryId);
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
}

async function updateCategory(categoryId, data) {
  const category = await categoryRepository.findById(categoryId);
  if (!category) {
    throw new Error('Category not found');
  }

  if (data.name) {
    const existing = await categoryRepository.findByName(data.name);
    if (existing && Number(existing.id) !== Number(categoryId)) {
      throw new Error('Category name already exists');
    }
  }

  if (data.parentId) {
    if (Number(data.parentId) === Number(categoryId)) {
      throw new Error('A category cannot be its own parent');
    }
    const parent = await categoryRepository.findById(data.parentId);
    if (!parent) {
      throw new Error('Parent category not found');
    }
  }

  return categoryRepository.updateById(categoryId, data);
}

async function deleteCategory(categoryId) {
  const category = await categoryRepository.getCategoryWithItems(categoryId);
  if (!category) {
    throw new Error('Category not found');
  }

  if (category.items && category.items.length > 0) {
    throw new Error('Cannot delete category that has associated products');
  }

  await categoryRepository.deleteById(categoryId);
  return { message: 'Category deleted successfully' };
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
