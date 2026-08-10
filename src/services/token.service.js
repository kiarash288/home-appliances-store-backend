const crypto = require('crypto');
const redisClient = require('../config/redis');

const EMAIL_VERIFICATION_TTL_SECONDS = 24 * 60 * 60; // 24 hours

/**
 * Generates a secure email verification token, stores userId in Redis, and returns the token.
 * @param {number|string} userId
 * @returns {Promise<string>}
 */
async function generateEmailVerificationToken(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const key = `verify_email:${token}`;

  await redisClient.setEx(key, EMAIL_VERIFICATION_TTL_SECONDS, String(userId));

  return token;
}

/**
 * Verifies an email token from Redis (single-use) and returns the associated userId.
 * @param {string} token
 * @returns {Promise<string>}
 */
async function verifyEmailToken(token) {
  const key = `verify_email:${token}`;
  const userId = await redisClient.get(key);

  if (!userId) {
    throw new Error('Invalid or expired token');
  }

  await redisClient.del(key);
  return userId;
}

module.exports = {
  generateEmailVerificationToken,
  verifyEmailToken,
};
