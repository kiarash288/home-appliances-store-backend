const { z } = require('zod');
const { numberField, idField } = require('./common.validator');

/**
 * Basket body schemas.
 *
 * The basket itself is resolved from the authenticated user, never from the body.
 */

const quantityField = numberField('Quantity').pipe(
  z
    .number()
    .int({ error: 'Quantity must be an integer' })
    .min(1, { error: 'Quantity must be at least 1' })
    .max(100, { error: 'Quantity must be at most 100' })
);

// Allows 0 so the client can clear a line item via PUT
const updateQuantityField = numberField('Quantity').pipe(
  z
    .number()
    .int({ error: 'Quantity must be an integer' })
    .min(0, { error: 'Quantity must be at least 0' })
    .max(100, { error: 'Quantity must be at most 100' })
);

const addItemSchema = z
  .object({
    productId: idField('Product id'),
    quantity: quantityField,
  })
  .strict();

const updateQuantitySchema = z
  .object({
    quantity: updateQuantityField,
  })
  .strict();

module.exports = {
  addItemSchema,
  updateQuantitySchema,
};
