const transporter = require('../config/mail');

/**
 * Sends a one-time verification code to the given email address.
 * @param {string} toEmail
 * @param {string} otpCode
 */
async function sendOtpEmail(toEmail, otpCode) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: 'Your verification code',
    text: `Your verification code is ${otpCode}. It will expire in 2 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
        <h2 style="margin-bottom: 8px;">Verification Code</h2>
        <p>Your verification code is <b style="font-size: 20px; letter-spacing: 2px;">${otpCode}</b>.</p>
        <p>It will expire in <b>2 minutes</b>.</p>
        <p style="color: #666; font-size: 13px;">If you did not request this code, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw new Error('Failed to send verification email');
  }
}

module.exports = {
  sendOtpEmail,
};
