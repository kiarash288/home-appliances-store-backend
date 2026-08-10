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

/**
 * Sends an email verification link to the given address.
 * @param {string} email
 * @param {string} token
 */
async function sendVerificationLink(email, token) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const verifyUrl = `${frontendUrl}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your email address',
    text: `Please verify your email by opening this link: ${verifyUrl}. This link expires in 24 hours.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
        <h2 style="margin-bottom: 8px;">Verify your email</h2>
        <p>Thanks for signing up. Please confirm your email address by clicking the button below.</p>
        <p style="margin: 24px 0;">
          <a href="${verifyUrl}" style="background:#111;color:#fff;padding:12px 20px;text-decoration:none;border-radius:4px;display:inline-block;">
            Verify Email
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break:break-all;color:#555;">${verifyUrl}</p>
        <p style="color:#666;font-size:13px;">This link expires in <b>24 hours</b>. If you did not create an account, you can ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send verification link email:', error);
    throw new Error('Failed to send verification email');
  }
}

module.exports = {
  sendOtpEmail,
  sendVerificationLink,
};
