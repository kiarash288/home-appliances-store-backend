const axios = require('axios');
const { sequelize } = require('../models');
const paymentRepository = require('../repositories/payment.repository');
const orderRepository = require('../repositories/order.repository');

const ZARINPAL_REQUEST_URL =
  'https://api.zarinpal.com/pg/v4/payment/request.json';
const ZARINPAL_VERIFY_URL =
  'https://api.zarinpal.com/pg/v4/payment/verify.json';
const ZARINPAL_START_PAY_BASE = 'https://www.zarinpal.com/pg/StartPay';
const GATEWAY_NAME = 'zarinpal';

function getMerchantId() {
  const merchantId = process.env.ZARINPAL_MERCHANT_ID;
  if (!merchantId) {
    throw new Error('ZARINPAL_MERCHANT_ID is not configured');
  }
  return merchantId;
}

function getCallbackUrl() {
  const appUrl = process.env.APP_URL;
  if (!appUrl) {
    throw new Error('APP_URL is not configured');
  }
  return `${appUrl.replace(/\/$/, '')}/api/payments/callback`;
}

function toZarinpalAmount(amount) {
  return Math.round(Number(amount));
}

function extractZarinpalError(payload, fallback) {
  const errors = payload?.errors;
  if (typeof errors?.message === 'string') {
    return errors.message;
  }
  if (Array.isArray(errors) && errors.length > 0) {
    return errors
      .map((e) => (typeof e === 'string' ? e : e.message))
      .filter(Boolean)
      .join(', ');
  }
  if (typeof payload?.data?.message === 'string') {
    return payload.data.message;
  }
  return fallback;
}

async function initiatePayment(userId, orderId) {
  const order = await orderRepository.getOrderWithDetails(orderId, userId);
  if (!order) {
    throw new Error('Order not found');
  }

  if (order.status !== 'pending') {
    throw new Error('Order is already paid or cannot be paid');
  }

  const amount = toZarinpalAmount(order.total_amount);

  let zarinpalPayload;
  try {
    const { data } = await axios.post(ZARINPAL_REQUEST_URL, {
      merchant_id: getMerchantId(),
      amount,
      description: `Payment for order #${order.id}`,
      callback_url: getCallbackUrl(),
    });
    zarinpalPayload = data;
  } catch (error) {
    throw new Error(
      extractZarinpalError(error.response?.data, error.message) ||
        'ZarinPal request failed'
    );
  }

  const code = zarinpalPayload?.data?.code;
  const authority = zarinpalPayload?.data?.authority;

  if (code !== 100 || !authority) {
    throw new Error(
      extractZarinpalError(zarinpalPayload, 'Failed to initiate ZarinPal payment')
    );
  }

  const payment = await paymentRepository.create({
    order_id: order.id,
    amount: order.total_amount,
    gateway_name: GATEWAY_NAME,
    tracking_code: authority,
    status: 'pending',
  });

  return {
    payment,
    authority,
    redirectUrl: `${ZARINPAL_START_PAY_BASE}/${authority}`,
  };
}

async function verifyPayment(authority, statusFromGateway) {
  if (!authority) {
    throw new Error('Authority is required');
  }

  if (String(statusFromGateway).toUpperCase() !== 'OK') {
    const pendingPayment = await paymentRepository.findByAuthority(authority);
    if (pendingPayment && pendingPayment.status === 'pending') {
      await pendingPayment.update({ status: 'failed' });
    }
    throw new Error('Payment canceled by user');
  }

  const transaction = await sequelize.transaction();
  let paymentId = null;
  let failedPersisted = false;

  try {
    const payment = await paymentRepository.findByAuthority(authority, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    paymentId = payment.id;

    if (payment.status === 'success' || payment.status === 'failed') {
      throw new Error('Payment already processed');
    }

    let verifyPayload;
    try {
      const { data } = await axios.post(ZARINPAL_VERIFY_URL, {
        merchant_id: getMerchantId(),
        amount: toZarinpalAmount(payment.amount),
        authority,
      });
      verifyPayload = data;
    } catch (error) {
      await payment.update({ status: 'failed' }, { transaction });
      failedPersisted = true;
      await transaction.commit();
      throw new Error(
        extractZarinpalError(error.response?.data, error.message) ||
          'ZarinPal verify request failed'
      );
    }

    const code = verifyPayload?.data?.code;
    const refId = verifyPayload?.data?.ref_id;

    if (code !== 100 && code !== 101) {
      await payment.update({ status: 'failed' }, { transaction });
      failedPersisted = true;
      await transaction.commit();
      throw new Error(
        extractZarinpalError(verifyPayload, 'Payment verification failed')
      );
    }

    await payment.update(
      {
        status: 'success',
        ref_id: refId != null ? String(refId) : null,
      },
      { transaction }
    );

    const order = await orderRepository.findById(payment.order_id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    await order.update({ status: 'processing' }, { transaction });
    await transaction.commit();

    return {
      payment,
      order,
      refId,
      status: 'success',
    };
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    const skipFailedUpdate =
      failedPersisted ||
      !paymentId ||
      error.message.includes('already processed') ||
      error.message.includes('Payment not found') ||
      error.message.includes('canceled');

    if (!skipFailedUpdate) {
      try {
        await paymentRepository.updateById(paymentId, { status: 'failed' });
      } catch (_) {
        // Secondary failure must not mask the original error
      }
    }

    throw error;
  }
}

module.exports = {
  initiatePayment,
  verifyPayment,
};
