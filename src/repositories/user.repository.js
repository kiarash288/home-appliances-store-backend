const { User } = require('../models');
// front always has a user-id and item-id
async function create(userData) {
  return User.create(userData);
}

async function getAll() {
  return User.findAll();
}

async function findById(id) {
  return User.findByPk(id);
}

async function updateById(id, updateData) {
  const user = await User.findByPk(id);
  if (!user) {
    return null;
  }
  return user.update(updateData);
}

async function deleteById(id) {
  return User.destroy({ where: { id } });
}


async function findByEmail(email) {
  return User.findOne({ where: { email } });
}



module.exports = {
  create,
  findById,
  findByEmail,
  getAll,
  updateById,
  deleteById,
};
