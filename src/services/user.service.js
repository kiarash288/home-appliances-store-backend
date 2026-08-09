const crypto = require('crypto');
const { promisify } = require('util');
const userRepository = require('../repositories/user.repository');
const favoriteRepository = require('../repositories/favorite.repository');
const otpService = require('./otp.service');
const mailService = require('./mail.service');
const smsService = require('./sms.service');

const scrypt = promisify(crypto.scrypt);

function toPublicUser(user) {
  if (!user) {
    return null;
  }

  const data = typeof user.toJSON === 'function' ? user.toJSON() : { ...user };
  delete data.password;
  return data;
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

async function getProfile(userId) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return toPublicUser(user);
}

async function updateProfile(userId, profileData) {
  const updated = await userRepository.updateById(userId, profileData);
  if (!updated) {
    throw new Error('User not found');
  }
  return toPublicUser(updated);
}



async function requestPasswordReset(email) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  const otp = await otpService.generateOtp(email, 'password');
  await mailService.sendOtpEmail(email, otp);

  return { message: 'Password reset verification code sent to your email' };
}

async function verifyPasswordReset(email, otp, newPassword) {
  await otpService.verifyOtp(email, otp, 'password');

  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  const hashedPassword = await hashPassword(newPassword);
  await userRepository.updateById(user.id, { password: hashedPassword });

  return { message: 'Password reset successfully' };
}

async function requestChangeEmail(userId, newEmail) {
  const existing = await userRepository.findByEmail(newEmail);
  if (existing && Number(existing.id) !== Number(userId)) {
    throw new Error('Email already in use');
  }

  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const otp = await otpService.generateOtp(newEmail, 'email');
  await mailService.sendOtpEmail(newEmail, otp);

  return {
    message: 'Verification code sent to the new email address',
    email: newEmail,
  };
}

async function verifyChangeEmail(userId, newEmail, otp) {
  await otpService.verifyOtp(newEmail, otp, 'email');

  const existing = await userRepository.findByEmail(newEmail);
  if (existing && Number(existing.id) !== Number(userId)) {
    throw new Error('Email already in use');
  }

  const updated = await userRepository.updateById(userId, { email: newEmail });
  if (!updated) {
    throw new Error('User not found');
  }

  return { message: 'Email updated successfully', user: toPublicUser(updated) };
}

async function requestChangePhone(userId, newPhone) {
  const existing = await userRepository.findByPhone(newPhone);
  if (existing && Number(existing.id) !== Number(userId)) {
    throw new Error('Phone number already in use');
  }

  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const otp = await otpService.generateOtp(newPhone, 'phone');
  await smsService.sendOtpSms(newPhone, otp);

  return {
    message: 'Verification code sent to the new phone number',
    phone: newPhone,
  };
}

async function verifyChangePhone(userId, newPhone, otp) {
  await otpService.verifyOtp(newPhone, otp, 'phone');

  const existing = await userRepository.findByPhone(newPhone);
  if (existing && Number(existing.id) !== Number(userId)) {
    throw new Error('Phone number already in use');
  }

  const updated = await userRepository.updateById(userId, { phone: newPhone });
  if (!updated) {
    throw new Error('User not found');
  }

  return { message: 'Phone number updated successfully', user: toPublicUser(updated) };
}

async function getFavorites(userId) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return favoriteRepository.getUserFavorites(userId);
}

async function getAllUsers() {
  const users = await userRepository.getAll();
  return users.map(toPublicUser);
}

async function getUserById(id) {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  return toPublicUser(user);
}

async function updateUserById(id, updateData) {
  if (updateData.email) {
    const existing = await userRepository.findByEmail(updateData.email);
    if (existing && Number(existing.id) !== Number(id)) {
      throw new Error('Email already in use');
    }
  }

  const updated = await userRepository.updateById(id, updateData);
  if (!updated) {
    throw new Error('User not found');
  }
  return toPublicUser(updated);
}

async function updateUserRole(id, { role }) {
  const updated = await userRepository.updateById(id, { role });
  if (!updated) {
    throw new Error('User not found');
  }
  return toPublicUser(updated);
}

async function deleteUser(id) {
  const deletedCount = await userRepository.deleteById(id);
  if (!deletedCount) {
    throw new Error('User not found');
  }
  return { message: 'User deleted successfully' };
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  requestPasswordReset,
  verifyPasswordReset,
  requestChangeEmail,
  verifyChangeEmail,
  requestChangePhone,
  verifyChangePhone,
  getFavorites,
  getAllUsers,
  getUserById,
  updateUserById,
  updateUserRole,
  deleteUser,
};
