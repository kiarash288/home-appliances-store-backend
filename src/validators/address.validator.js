const { z } = require('zod');
const {
  POSTAL_CODE_REGEX,
  stringField,
  phoneField,
  requireAtLeastOneField,
} = require('./common.validator');

/**
 * Address body schemas.
 *
 * Model mapping (src/models/Address.js):
 * `postalCode` -> `postal_code`, `fullAddress` -> `full_address`,
 * `phone` -> `phone_number`, `isDefault` -> `is_default`.
 */

const addressShape = {
  title: stringField('Title', { min: 2, max: 100 }),
  city: stringField('City', { min: 2, max: 100 }),
  state: stringField('State', { min: 2, max: 100 }),
  postalCode: stringField('Postal code').regex(POSTAL_CODE_REGEX, {
    message: 'Postal code must be exactly 10 digits',
  }),
  fullAddress: stringField('Full address', { min: 5, max: 1000 }),
  phone: phoneField,
  isDefault: z.boolean({ error: 'isDefault must be true or false' }).optional(),
};

const createAddressSchema = z.object(addressShape).strict();

const updateAddressSchema = requireAtLeastOneField(
  z.object(addressShape).strict().partial()
);

module.exports = {
  createAddressSchema,
  updateAddressSchema,
};
