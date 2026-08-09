const addressService = require('../services/address.service');

function getStatusCode(error) {
  const message = error.message || '';

  if (message.includes('not found') || message.includes('unauthorized')) {
    return 404;
  }

  if (message.includes('limit reached')) {
    return 400;
  }

  return 500;
}

async function addAddress(req, res) {
  try {
    const address = await addressService.addAddress(req.user.id, req.body);
    return res.status(201).json(address);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function getUserAddresses(req, res) {
  try {
    const addresses = await addressService.getUserAddresses(req.user.id);
    return res.status(200).json(addresses);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function updateAddress(req, res) {
  try {
    const address = await addressService.updateAddress(
      req.user.id,
      req.params.id,
      req.body
    );
    return res.status(200).json(address);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function deleteAddress(req, res) {
  try {
    const result = await addressService.deleteAddress(req.user.id, req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function setAddressAsDefault(req, res) {
  try {
    const address = await addressService.setAddressAsDefault(
      req.user.id,
      req.params.id
    );
    return res.status(200).json(address);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function getAddressesByUserIdAsAdmin(req, res) {
  try {
    const addresses = await addressService.getAddressesByUserIdAsAdmin(
      req.params.userId
    );
    return res.status(200).json(addresses);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function updateAddressAsAdmin(req, res) {
  try {
    const address = await addressService.updateAddressAsAdmin(
      req.params.id,
      req.body
    );
    return res.status(200).json(address);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function deleteAddressAsAdmin(req, res) {
  try {
    const result = await addressService.deleteAddressAsAdmin(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

module.exports = {
  addAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
  setAddressAsDefault,
  getAddressesByUserIdAsAdmin,
  updateAddressAsAdmin,
  deleteAddressAsAdmin,
};
