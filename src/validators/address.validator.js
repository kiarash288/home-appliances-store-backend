const { z } = require('zod');
const {
  POSTAL_CODE_REGEX,
  MOBILE_REGEX,
  stringField,
  requireAtLeastOneField,
} = require('./common.validator');

/**
 * Address body schemas.
 *
 * Model mapping (src/models/Address.js): `street` and `plaque` are combined by
 * the controller into the `full_address` column; `postalCode` -> `postal_code`,
 * `phone` -> `phone_number`, `isDefault` -> `is_default`.
 */

const addressShape = {
  // Optional label such as "Home" or "Office"
  title: stringField('Title', { min: 2, max: 100 }).optional(),
  city: stringField('City', { min: 2, max: 100 }),
  street: stringField('Street', { min: 2, max: 500 }),
  plaque: stringField('Plaque', { min: 1, max: 20 }),
  postalCode: z
    .string({
      error: (issue) =>
        issue.input === undefined ? 'Postal code is required' : 'Postal code must be a string',
    })
    .trim()
    .regex(POSTAL_CODE_REGEX, { error: 'Postal code must be exactly 10 digits' }),
  phone: z
    .string({
      error: (issue) =>
        issue.input === undefined ? 'Phone number is required' : 'Phone number must be a string',
    })
    .trim()
    .regex(MOBILE_REGEX, {
      error: 'Phone number must start with 09 and contain exactly 11 digits',
    }),
  isDefault: z
    .boolean({ error: 'isDefault must be true or false' })
    .optional(),
};

const createAddressSchema = z.object(addressShape).strict();

const updateAddressSchema = requireAtLeastOneField(createAddressSchema.partial());

module.exports = {
  createAddressSchema,
  updateAddressSchema,
};
