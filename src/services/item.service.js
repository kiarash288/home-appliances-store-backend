const itemRepository = require('../repositories/item.repository');
const categoryRepository = require('../repositories/category.repository');

function mapItemFields(data = {}) {
  const mapped = {};

  if (data.name !== undefined) mapped.name = data.name;
  if (data.description !== undefined) mapped.description = data.description;
  if (data.price !== undefined) mapped.price = data.price;
  if (data.stock !== undefined) mapped.stock = data.stock;
  if (data.categoryId !== undefined) mapped.category_id = data.categoryId;
  if (data.mainImage !== undefined) mapped.main_image = data.mainImage;
  if (data.gallery !== undefined) mapped.gallery = data.gallery;

  return mapped;
}

async function getAllItems(query = {}) {
  return itemRepository.getAll(query);
}

async function getItemById(id) {
  const item = await itemRepository.findByIdWithDetails(id);
  if (!item) {
    throw new Error('Item not found');
  }
  return item;
}

async function createItem(data, userId) {
  if (data.categoryId) {
    const category = await categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
  }

  return itemRepository.create({
    ...mapItemFields(data),
    user_id: userId,
  });
}

async function updateItem(id, data) {
  const item = await itemRepository.findById(id);
  if (!item) {
    throw new Error('Item not found');
  }

  if (data.categoryId) {
    const category = await categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
  }

  return itemRepository.updateById(id, mapItemFields(data));
}

async function deleteItem(id) {
  const item = await itemRepository.findById(id);
  if (!item) {
    throw new Error('Item not found');
  }

  await itemRepository.deleteById(id);
  return { message: 'Item deleted successfully' };
}

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
