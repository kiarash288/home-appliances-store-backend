const { Category, Item } = require('../models');

async function create(categoryData) {
  return Category.create(categoryData);
}

async function findById(id) {
  return Category.findByPk(id);
}

async function findByName(name) {
  return Category.findOne({ where: { name } });
}

async function getAll() {
  return Category.findAll();
}

async function updateById(id, updateData) {
  const category = await Category.findByPk(id);
  if (!category) {
    return null;
  }
  return category.update(updateData);
}

async function deleteById(id) {
  return Category.destroy({ where: { id } });
}

async function getCategoryWithItems(id) {
  return Category.findByPk(id, {
    include: [
      {
        model: Item,
        as: 'items',
      },
    ],
  });
}

module.exports = {
  create,
  findById,
  findByName,
  getAll,
  updateById,
  deleteById,
  getCategoryWithItems,
};
