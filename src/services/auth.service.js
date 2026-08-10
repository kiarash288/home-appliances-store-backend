const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const mailService = require('./mail.service');
const tokenService = require('./token.service');

const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const BCRYPT_ROUNDS = 10;

function toPublicUser(user) {
  if (!user) {
    return null;
  }

  const data = typeof user.toJSON === 'function' ? user.toJSON() : { ...user };
  delete data.password;
  delete data.refreshToken;
  return data;
}

function getAccessSecret() {
  return process.env.JWT_SECRET;
}

function getRefreshSecret() {
  return process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
}

function signAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      is_verified: Boolean(user.isVerified),
    },
    getAccessSecret(),
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { id: user.id, type: 'refresh' },
    getRefreshSecret(),
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
}

async function register(userData) {
  const existingEmail = await userRepository.findByEmail(userData.email);
  if (existingEmail) {
    throw new Error('Email already in use');
  }

  if (userData.phone) {
    const existingPhone = await userRepository.findByPhone(userData.phone);
    if (existingPhone) {
      throw new Error('Phone number already in use');
    }
  }

  const hashedPassword = await bcrypt.hash(userData.password, BCRYPT_ROUNDS);

  const user = await userRepository.create({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone,
    password: hashedPassword,
    isVerified: false,
  });

  const token = await tokenService.generateEmailVerificationToken(user.id);
  await mailService.sendVerificationLink(user.email, token);

  return toPublicUser(user);
}

async function verifyEmail(token) {
  const userId = await tokenService.verifyEmailToken(token);

  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.isVerified) {
    return { message: 'Email is already verified', user: toPublicUser(user) };
  }

  const updated = await userRepository.updateById(userId, { isVerified: true });
  return {
    message: 'Email verified successfully',
    user: toPublicUser(updated),
  };
}

async function resendVerificationEmail(userId) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.isVerified) {
    throw new Error('Email is already verified');
  }

  const token = await tokenService.generateEmailVerificationToken(user.id);
  await mailService.sendVerificationLink(user.email, token);

  return { message: 'Verification email sent successfully' };
}

async function login(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  await userRepository.updateById(user.id, { refreshToken });

  return {
    user: toPublicUser(user),
    accessToken,
    refreshToken,
  };
}

async function logout(userId) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  await userRepository.updateById(userId, { refreshToken: null });
  return { message: 'Logged out successfully' };
}

async function refreshAccessToken(incomingRefreshToken) {
  let decoded;

  try {
    decoded = jwt.verify(incomingRefreshToken, getRefreshSecret());
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }

  if (decoded.type !== 'refresh') {
    throw new Error('Invalid or expired refresh token');
  }

  const user = await userRepository.findByRefreshToken(incomingRefreshToken);
  if (!user || Number(user.id) !== Number(decoded.id)) {
    throw new Error('Invalid or expired refresh token');
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  await userRepository.updateById(user.id, { refreshToken });

  return {
    accessToken,
    refreshToken,
  };
}

module.exports = {
  register,
  verifyEmail,
  resendVerificationEmail,
  login,
  logout,
  refreshAccessToken,
};
