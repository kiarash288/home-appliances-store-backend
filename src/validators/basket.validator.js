const { z } = require('zod');
const { numberField, idField } = require('./common.validator');

/**
 * Basket body schemas.
 *
 * Model mapping (src/models/BasketItem.js): `itemId` -> `item_id`.
 * The basket itself is resolved from the authenticated user, never from the body.
 */

// Upper bound guards against a single request reserving the whole stock
const quantityField = numberField('Quantity').pipe(
  z
    .number()
    .int({ error: 'Quantity must be an integer' })
    .min(1, { error: 'Quantity must be at least 1' })
    .max(100, { error: 'Quantity must be at most 100' })
);

const addItemSchema = z
  .object({
    itemId: idField('Item id'),
    quantity: quantityField,
  })
  .strict();

const updateQuantitySchema = z
  .object({
    quantity: quantityField,
  })
  .strict();

module.exports = {
  addItemSchema,
  updateQuantitySchema,
};
