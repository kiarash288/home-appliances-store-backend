const { Op } = require('sequelize');
const { Item, Category, Review, User } = require('../models');

async function create(itemData) {
  return Item.create(itemData);
}

async function findById(id) {
  return Item.findByPk(id);
}

async function getAll(queryFilters = {}) {
  const where = {};

  if (queryFilters.name) {
    where.name = { [Op.like]: `%${queryFilters.name}%` };
  }

  const categoryId = queryFilters.categoryId || queryFilters.category_id;
  if (categoryId) {
    where.category_id = categoryId;
  }

  const page = parseInt(queryFilters.page, 10) || 1;
  const limit = parseInt(queryFilters.limit, 10) || 20;
  const offset = (page - 1) * limit;

  const { count, rows } = await Item.findAndCountAll({
    where,
    include: [
      {
        model: Category,
        as: 'category',
      },
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    distinct: true,
  });

  const totalPages = Math.ceil(count / limit);

  return {
    totalItems: count,
    totalPages,
    currentPage: page,
    items: rows,
  };
}

async function getItemByDetails(id) {
  return Item.findByPk(id, {
    include: [
      {
        model: Category,
        as: 'category',
      },
      {
        model: Review,
        as: 'reviews',
        // این بخش اضافه شده تا نویسنده هر کامنت هم مشخص شود
        include: [
          {
            model: User,
            as: 'user', // یا هر alias که در رابطه Review و User تعریف کردی
            attributes: ['id', 'username', 'email'] // برای امنیت، پسورد یا دیتای اضافی رو نگیر
          }
        ]
      },
      {
        model: User,
        as: 'creator',
      }
    ],
  });
}

async function findByIdWithDetails(id) {
  return Item.findByPk(id, {
    include: [
      {
        model: Category,
        as: 'category',
      },
      {
        model: Review,
        as: 'reviews',
      },
    ],
  });
}

async function updateById(id, updateData) {
  const item = await Item.findByPk(id);
  if (!item) {
    return null;
  }
  return item.update(updateData);
}

async function deleteById(id) {
  return Item.destroy({ where: { id } });
}

async function decreaseStock(id, quantity) {
  return Item.decrement('stock', {
    by: quantity,
    where: { id },
  });
}

async function increaseStock(id, quantity) {
  return Item.increment('stock', {
    by: quantity,
    where: { id },
  });
}

module.exports = {
  create,
  findById,
  getAll,
  findByIdWithDetails,
  updateById,
  deleteById,
  decreaseStock,
  increaseStock,
  getItemByDetails,
};
