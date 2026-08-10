const authService = require('../services/auth.service');

const REFRESH_COOKIE_NAME = 'refreshToken';
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function getStatusCode(error) {
  const message = error.message || '';

  if (message.includes('not found')) {
    return 404;
  }

  if (
    message === 'Email already in use' ||
    message === 'Phone number already in use'
  ) {
    return 409;
  }

  if (message === 'Email is already verified') {
    return 400;
  }

  if (
    message === 'Invalid email or password' ||
    message === 'Invalid or expired refresh token' ||
    message === 'Invalid or expired token'
  ) {
    return 401;
  }

  if (message === 'Failed to send verification email') {
    return 500;
  }

  return 500;
}

async function register(req, res) {
  try {
    const user = await authService.register(req.body);
    return res.status(201).json({
      message:
        'Registration successful. Please check your email inbox to verify your account.',
      user,
    });
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function verifyEmail(req, res) {
  try {
    const result = await authService.verifyEmail(req.body.token);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function resendVerification(req, res) {
  try {
    const result = await authService.resendVerificationEmail(req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, REFRESH_COOKIE_OPTIONS);

    return res.status(200).json({
      message: 'Login successful',
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function logout(req, res) {
  try {
    const result = await authService.logout(req.user.id);
    res.clearCookie(REFRESH_COOKIE_NAME);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function refresh(req, res) {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        error: 'Unauthorized: No refresh token in cookies',
      });
    }

    const result = await authService.refreshAccessToken(refreshToken);

    res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, REFRESH_COOKIE_OPTIONS);

    return res.status(200).json({
      message: 'Token refreshed successfully',
      accessToken: result.accessToken,
    });
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

module.exports = {
  register,
  verifyEmail,
  resendVerification,
  login,
  logout,
  refresh,
};
