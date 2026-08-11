const { z } = require('zod');
const { stringField } = require('./common.validator');

/**
 * ZarinPal callback query params (GET /api/payments/callback).
 * ZarinPal sends `Authority` and `Status` (Status is "OK" or "NOK").
 */
const zarinpalCallbackSchema = z
  .object({
    Authority: stringField('Authority', { min: 1, max: 255 }),
    Status: z.enum(['OK', 'NOK'], {
      error: 'Status must be OK or NOK',
    }),
  })
  .passthrough();

module.exports = {
  zarinpalCallbackSchema,
};
