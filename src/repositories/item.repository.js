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

  if (queryFilters.category_id) {
    where.category_id = queryFilters.category_id;
  }

  // ۱. دریافت شماره صفحه و تعداد آیتم‌ها (با مقادیر پیش‌فرض)
  const page = parseInt(queryFilters.page) || 1;   // اگر صفحه‌ای نداد، همون صفحه ۱ رو در نظر بگیر
  const limit = parseInt(queryFilters.limit) || 20; // دیفالت ۲۰ آیتم در هر صفحه

  // ۲. محاسبه Offset
  const offset = (page - 1) * limit; 
  /* 
    مثال برای درک Offset:
    صفحه ۱: (1 - 1) * 20 = 0  -> هیچی رو رد نکن، 20 تای اول رو بده
    صفحه ۲: (2 - 1) * 20 = 20 -> 20 تای اول رو رد کن، از 21 تا 40 رو بده
  */

  // ۳. کوئری زدن به دیتابیس
  const { count, rows } = await Item.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']], // مرتب‌سازی: جدیدترین‌ها اول
  });

  // ۴. محاسبه تعداد کل صفحات
  const totalPages = Math.ceil(count / limit);

  // ۵. ساختاردهی خروجی برای فرانت‌اند
  return {
    totalItems: count,      // کل آیتم‌های موجود تو دیتابیس (مثلا 150 تا)
    totalPages: totalPages, // کل صفحات (مثلا 8 صفحه)
    currentPage: page,      // صفحه فعلی (مثلا 2)
    items: rows,            // دیتای همون 20 تا آیتم صفحه فعلی
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
