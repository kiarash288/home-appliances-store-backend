const { Address } = require('../models');

async function create(addressData) {
  return Address.create(addressData);
}

async function findById(id) {
  return Address.findByPk(id);
}

async function deleteById(id) {
  return Address.destroy({ where: { id } });
}

async function updateById(id, updateData) {
  const address = await Address.findByPk(id);
  if (!address) {
    return null;
  }
  return address.update(updateData);
}

async function getUserAddresses(userId) {
  return Address.findAll({
    where: { userId },
  });
}

async function checkLimitation(userId) {
  const count = await Address.count({
    where: { userId },
  });
  return count < 3;
}

async function resetUserDefaultAddresses(userId) {
  return Address.update(
    { isDefault: false },
    { where: { userId } }
  );
}

module.exports = {
  create,
  findById,
  deleteById,
  updateById,
  getUserAddresses,
  checkLimitation,
  resetUserDefaultAddresses,
};
