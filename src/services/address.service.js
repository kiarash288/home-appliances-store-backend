const addressRepository = require('../repositories/address.repository');

function assertOwnedAddress(address, userId) {
  if (!address || Number(address.userId) !== Number(userId)) {
    throw new Error('Address not found or unauthorized');
  }
}

async function addAddress(userId, addressData) {
  const canAdd = await addressRepository.checkLimitation(userId);
  if (!canAdd) {
    throw new Error('Address limit reached. You can have at most 3 addresses');
  }

  if (addressData.isDefault) {
    await addressRepository.resetUserDefaultAddresses(userId);
  }

  return addressRepository.create({
    userId,
    ...addressData,
  });
}

async function getUserAddresses(userId) {
  return addressRepository.getUserAddresses(userId);
}

async function updateAddress(userId, addressId, updateData) {
  const address = await addressRepository.findById(addressId);
  assertOwnedAddress(address, userId);

  if (updateData.isDefault) {
    await addressRepository.resetUserDefaultAddresses(userId);
  }

  return addressRepository.updateById(addressId, updateData);
}

async function deleteAddress(userId, addressId) {
  const address = await addressRepository.findById(addressId);
  assertOwnedAddress(address, userId);

  await addressRepository.deleteById(addressId);
  return { message: 'Address deleted successfully' };
}

async function setAddressAsDefault(userId, addressId) {
  const address = await addressRepository.findById(addressId);
  assertOwnedAddress(address, userId);

  await addressRepository.resetUserDefaultAddresses(userId);
  return addressRepository.updateById(addressId, { isDefault: true });
}

async function updateAddressAsAdmin(addressId, updateData) {
  const address = await addressRepository.findById(addressId);
  if (!address) {
    throw new Error('Address not found');
  }

  return addressRepository.updateById(addressId, updateData);
}

async function deleteAddressAsAdmin(addressId) {
  const address = await addressRepository.findById(addressId);
  if (!address) {
    throw new Error('Address not found');
  }

  await addressRepository.deleteById(addressId);
  return { message: 'Address deleted successfully' };
}

async function getAddressesByUserIdAsAdmin(userId) {
  return addressRepository.getUserAddresses(userId);
}

module.exports = {
  addAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
  setAddressAsDefault,
  updateAddressAsAdmin,
  deleteAddressAsAdmin,
  getAddressesByUserIdAsAdmin,
};
