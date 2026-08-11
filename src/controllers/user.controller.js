const userService = require('../services/user.service');

function getStatusCode(error) {
  const message = error.message || '';

  if (message === 'User not found' || message.includes('not found')) {
    return 404;
  }

  if (message === 'Email already in use' || message === 'Phone number already in use') {
    return 409;
  }

  if (
    message === 'OTP is required' ||
    message === 'Email is required' ||
    message === 'Phone number is required' ||
    message === 'OTP is expired or invalid' ||
    message === 'Invalid OTP' ||
    message === 'Failed to send verification email' ||
    message === 'Failed to send verification SMS' ||
    message.includes('not supported')
  ) {
    return 400;
  }

  return 500;
}

async function getProfile(req, res) {
  try {
    const user = await userService.getProfile(req.user.id);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function updateProfile(req, res) {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function changePassword(req, res) {
  try {
    // Authenticated user: send OTP to their account email
    const user = await userService.getProfile(req.user.id);
    const result = await userService.requestPasswordReset(user.email);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

/**
 * Public password-reset request.
 * Body: { email } — generates an OTP and emails it to the user.
 */
async function requestPasswordReset(req, res) {
  try {
    const result = await userService.requestPasswordReset(req.body.email);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

/**
 * Verify OTP and set a new password (public or authenticated verify routes).
 * Body: { email, otp, newPassword }
 */
async function verifyChangePassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;
    const result = await userService.verifyPasswordReset(email, otp, newPassword);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

/** Alias used for the public reset-password verify step */
const resetPassword = verifyChangePassword;


async function requestChangeEmail(req, res) {
  try {
    const result = await userService.requestChangeEmail(req.user.id, req.body.email);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function verifyChangeEmail(req, res) {
  try {
    const { email, otp } = req.body;
    const result = await userService.verifyChangeEmail(req.user.id, email, otp);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function requestChangePhone(req, res) {
  try {
    const result = await userService.requestChangePhone(req.user.id, req.body.phone);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function verifyChangePhone(req, res) {
  try {
    const { phone, otp } = req.body;
    const result = await userService.verifyChangePhone(req.user.id, phone, otp);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function getUserById(req, res) {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function updateUserById(req, res) {
  try {
    const user = await userService.updateUserById(req.params.id, req.body);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function updateUserRole(req, res) {
  try {
    const user = await userService.updateUserRole(req.params.id, req.body);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const result = await userService.deleteUser(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  requestPasswordReset,
  verifyChangePassword,
  resetPassword,
  requestChangeEmail,
  verifyChangeEmail,
  requestChangePhone,
  verifyChangePhone,
  getAllUsers,
  getUserById,
  updateUserById,
  updateUserRole,
  deleteUser,
};
