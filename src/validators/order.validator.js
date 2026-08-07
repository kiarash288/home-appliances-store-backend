const { z } = require('zod');
const { idField } = require('./common.validator');

/**
 * Order body schemas.
 *
 * Model mapping (src/models/Order.js): `addressId` -> `address_id`. The status
 * ENUM is stored lower case, so the accepted upper case values are transformed
 * before they reach the model. Items, totals and the tracking code are derived
 * from the basket on the server and are never accepted from the client.
 */

const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const createOrderSchema = z
  .object({
    addressId: idField('Address id'),
  })
  .strict();

const updateStatusSchema = z
  .object({
    status: z
      .enum(ORDER_STATUSES, {
        error: `Status must be one of: ${ORDER_STATUSES.join(', ')}`,
      })
      .transform((status) => status.toLowerCase()),
  })
  .strict();

module.exports = {
  ORDER_STATUSES,
  createOrderSchema,
  updateStatusSchema,
};
