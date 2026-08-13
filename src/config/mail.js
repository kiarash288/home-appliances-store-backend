const nodemailer = require('nodemailer');

/**
 * SMTP transport.
 *
 * Port rules (this is the usual source of "email silently fails"):
 *   - 465  -> implicit TLS  -> secure: true
 *   - 587  -> STARTTLS      -> secure: false + requireTLS: true
 *
 * Timeouts are set so a blocked network fails fast with a clear error
 * instead of hanging the request.
 */
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  requireTLS: SMTP_PORT !== 465, // force STARTTLS upgrade on 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 20_000,
});

/**
 * Verifies the SMTP connection + credentials and logs a detailed report.
 * Call once at startup to surface configuration problems immediately.
 */
async function verifyMailConnection() {
  try {
    await transporter.verify();
    console.log(
      `✅ SMTP ready: ${process.env.SMTP_HOST}:${SMTP_PORT} as ${process.env.SMTP_USER}`
    );
    return true;
  } catch (error) {
    console.error('❌ SMTP connection failed');
    console.error(`   host: ${process.env.SMTP_HOST}:${SMTP_PORT}`);
    console.error(`   code: ${error.code || 'n/a'}`);
    console.error(`   responseCode: ${error.responseCode || 'n/a'}`);
    console.error(`   command: ${error.command || 'n/a'}`);
    console.error(`   message: ${error.message}`);

    if (error.code === 'EAUTH') {
      console.error(
        '   hint: Gmail rejected the login. Confirm the 16-char App Password (2FA must be ON) and that SMTP_USER matches the account that created it.'
      );
    } else if (
      ['ETIMEDOUT', 'ECONNECTION', 'ESOCKET', 'ECONNREFUSED'].includes(
        error.code
      )
    ) {
      console.error(
        '   hint: Could not reach the SMTP server. The network/ISP may block outbound SMTP — try port 465 (SMTP_PORT=465) or a VPN/other network.'
      );
    } else if (error.code === 'EDNS') {
      console.error('   hint: DNS lookup failed — check SMTP_HOST spelling.');
    }
    return false;
  }
}

module.exports = transporter;
module.exports.verifyMailConnection = verifyMailConnection;
