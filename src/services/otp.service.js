const redisClient = require('../config/redis');

/**
 * Generates a 5-digit OTP, stores it in Redis with a 120s TTL, and returns it.
 * @param {string} identifier - Email or phone number
 * @param {string} type - OTP purpose (e.g. 'email', 'phone', 'password')
 * @returns {Promise<string>}
 */
async function generateOtp(identifier, type) {
  const code = String(Math.floor(10000 + Math.random() * 90000));
  const key = `otp:${type}:${identifier}`;

  await redisClient.setEx(key, 120, code);

  return code;
}

/**
 * Verifies a one-time OTP and deletes it on success (single-use).
 * @param {string} identifier - Email or phone number
 * @param {string} code - User-provided OTP
 * @param {string} type - OTP purpose (e.g. 'email', 'phone', 'password')
 * @returns {Promise<true>}
 */
async function verifyOtp(identifier, code, type) {
  const key = `otp:${type}:${identifier}`;
  const storedCode = await redisClient.get(key);

  if (!storedCode) {
    throw new Error('OTP is expired or invalid');
  }

  if (storedCode !== String(code)) {
    throw new Error('Invalid OTP');
  }

  await redisClient.del(key);
  return true;
}

module.exports = {
  generateOtp,
  verifyOtp,
};
