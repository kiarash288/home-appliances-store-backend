/**
 * Ensures the authenticated user has a verified email.
 * Must be used after verifyToken so that req.user is already set.
 *
 * Note: `is_verified` is embedded in the access token at login/refresh time.
 * After verifying email, the client should refresh the access token.
 */
const requireVerifiedEmail = (req, res, next) => {
  if (!req.user || req.user.is_verified !== true) {
    return res.status(403).json({
      message:
        'Access denied. Please verify your email address to perform this action.',
    });
  }

  next();
};

module.exports = {
  requireVerifiedEmail,
};
