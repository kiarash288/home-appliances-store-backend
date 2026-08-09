const axios = require('axios');

/**
 * Sends a one-time verification code via Kavenegar Lookup (pattern) API.
 * @param {string} phoneNumber
 * @param {string} otpCode
 */
async function sendOtpSms(phoneNumber, otpCode) {
  const apiKey = process.env.SMS_API_KEY;
  const template = process.env.SMS_TEMPLATE_NAME;
  const url = `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json`;

  try {
    await axios.get(url, {
      params: {
        receptor: phoneNumber,
        template,
        token: otpCode,
      },
    });
  } catch (error) {
    console.error('Failed to send OTP SMS:', error.response?.data || error.message);
    throw new Error('Failed to send verification SMS');
  }
}

module.exports = {
  sendOtpSms,
};
