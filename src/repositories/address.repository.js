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
    where: { user_id: userId },
  });
}


async function deleteByUserAndId(userId, addressId) {
  return Address.destroy({
    where: {
      id: addressId,
      user_id: userId,
    },
  });
}

module.exports = {
  create,
  findById,
  getUserAddresses,
  updateById,
  deleteByUserAndId,
};
