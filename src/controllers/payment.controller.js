const paymentService = require('../services/payment.service');

function getStatusCode(error) {
  const message = error.message || '';

  if (message.includes('not found')) {
    return 404;
  }

  if (
    message.includes('already paid') ||
    message.includes('cannot be paid') ||
    message.includes('already processed') ||
    message.includes('canceled') ||
    message.includes('Authority is required') ||
    message.includes('verification failed') ||
    message.includes('Failed to initiate') ||
    message.includes('ZarinPal')
  ) {
    return 400;
  }

  if (message.includes('not configured')) {
    return 500;
  }

  return 500;
}

async function initiate(req, res) {
  try {
    const result = await paymentService.initiatePayment(
      req.user.id,
      req.params.orderId
    );
    return res.status(201).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function verifyCallback(req, res) {
  try {
    const authority = req.query.Authority || req.query.authority;
    const status = req.query.Status || req.query.status;

    const result = await paymentService.verifyPayment(authority, status);

    if (process.env.FRONTEND_URL) {
      const successUrl = new URL('/payment/success', process.env.FRONTEND_URL);
      if (result.refId != null) {
        successUrl.searchParams.set('refId', String(result.refId));
      }
      return res.redirect(successUrl.toString());
    }

    return res.status(200).json({
      message: 'Payment verified successfully',
      ...result,
    });
  } catch (error) {
    if (process.env.FRONTEND_URL) {
      const failUrl = new URL('/payment/failed', process.env.FRONTEND_URL);
      failUrl.searchParams.set('message', error.message);
      return res.redirect(failUrl.toString());
    }

    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

module.exports = {
  initiate,
  verifyCallback,
};
