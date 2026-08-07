const { z } = require('zod');
const {
  stringField,
  numberField,
  idField,
  priceField,
  requireAtLeastOneField,
} = require('./common.validator');

/**
 * Item body schemas.
 *
 * Model mapping (src/models/Item.js): the product title is stored in the `name`
 * column, `categoryId` -> `category_id`. `stock` is used by
 * item.repository (increaseStock/decreaseStock) but is not defined on the model
 * yet, so the column still needs to be added.
 *
 * `main_image` / `gallery` are populated from uploaded files (upload.middleware),
 * not from the request body, so they are intentionally not validated here.
 */

const createItemSchema = z
  .object({
    name: stringField('Name', { min: 2, max: 100 }),
    description: stringField('Description', { min: 10, max: 5000 }),
    price: priceField('Price'),
    stock: numberField('Stock').pipe(
      z
        .number()
        .int({ error: 'Stock must be an integer' })
        .nonnegative({ error: 'Stock cannot be negative' })
        .max(1000000, { error: 'Stock must be at most 1000000' })
    ),
    categoryId: idField('Category id'),
  })
  .strict();

const updateItemSchema = requireAtLeastOneField(createItemSchema.partial());

module.exports = {
  createItemSchema,
  updateItemSchema,
};
