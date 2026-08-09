const { z } = require('zod');

/**
 * Shared Zod building blocks used by the resource validators.
 *
 * Note on naming: request bodies use camelCase (e.g. postalCode, categoryId)
 * while the Sequelize models use snake_case columns (postal_code, category_id).
 * Controllers are responsible for mapping the validated data to model fields.
 */

// Exactly 10 digits (Iranian postal code)
const POSTAL_CODE_REGEX = /^\d{10}$/;

// Iranian mobile number: 09 followed by 9 digits (11 digits total)
const MOBILE_REGEX = /^09\d{9}$/;

// At least one lower case letter, one upper case letter and one digit
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

/**
 * Trimmed, non-empty string with explicit length bounds.
 *
 * @param {string} label - Human readable field name used in error messages
 * @param {{ min?: number, max?: number }} [bounds]
 */
const stringField = (label, { min = 1, max = 255 } = {}) =>
  z
    .string({
      error: (issue) =>
        issue.input === undefined ? `${label} is required` : `${label} must be a string`,
    })
    .trim()
    .min(min, { error: `${label} must be at least ${min} characters long` })
    .max(max, { error: `${label} must be at most ${max} characters long` });

/**
 * Number field that also accepts numeric strings (multipart/form-data sends
 * every field as a string) while still rejecting blank values, which
 * z.coerce.number() would otherwise silently turn into 0.
 *
 * @param {string} label - Human readable field name used in error messages
 */
const numberField = (label) =>
  z.preprocess(
    (value) => {
      if (typeof value !== 'string') {
        return value;
      }
      const trimmed = value.trim();
      if (trimmed === '') {
        return undefined;
      }
      const parsed = Number(trimmed);
      // Keep the original value when it is not numeric so the error message
      // reports a wrong type instead of a missing field
      return Number.isNaN(parsed) ? value : parsed;
    },
    z.number({
      error: (issue) =>
        issue.input === undefined ? `${label} is required` : `${label} must be a number`,
    })
  );

/**
 * Positive integer identifier (matches INTEGER UNSIGNED primary keys).
 *
 * @param {string} label - Human readable field name used in error messages
 */
const idField = (label) =>
  numberField(label).pipe(
    z
      .number()
      .int({ error: `${label} must be an integer` })
      .positive({ error: `${label} must be greater than 0` })
      .max(4294967295, { error: `${label} is out of range` })
  );

/**
 * Money amount limited to the range of the DECIMAL(10, 2) columns.
 *
 * @param {string} label - Human readable field name used in error messages
 */
const priceField = (label) =>
  numberField(label).pipe(
    z
      .number()
      .positive({ error: `${label} must be greater than 0` })
      .max(99999999.99, { error: `${label} must be at most 99999999.99` })
  );

/**
 * Strong password: min 8 chars, at least one lower case, one upper case, one digit.
 *
 * @param {string} label - Human readable field name used in error messages
 */
const passwordField = (label) =>
  stringField(label, { min: 8, max: 128 }).regex(STRONG_PASSWORD_REGEX, {
    error: `${label} must contain at least one lower case letter, one upper case letter and one digit`,
  });

/**
 * Rejects `{}` on update endpoints so a PUT/PATCH always carries a change.
 *
 * @param {import('zod').ZodObject} schema - A partial (all optional) object schema
 */
const requireAtLeastOneField = (schema) =>
  schema.refine((data) => Object.keys(data).length > 0, {
    error: 'At least one field must be provided',
  });

/**
 * 5-digit numeric OTP code (kept as string).
 */
const otpCodeField = stringField('Verification code')
  .length(5, { message: 'Verification code must be exactly 5 digits' })
  .regex(/^\d+$/, { message: 'Verification code must contain only numbers' });

/**
 * Normalized email address.
 */
const emailField = stringField('Email')
  .toLowerCase()
  .email({ message: 'Please provide a valid email address' });

/**
 * Iranian mobile number (kept as string to preserve leading zeros).
 */
const phoneField = stringField('Phone number').regex(MOBILE_REGEX, {
  message: 'Phone number must start with 09 and contain exactly 11 digits',
});

const verifyOtpSchema = z
  .object({
    otp: otpCodeField,
  })
  .strict();

const idParamSchema = z
  .object({
    id: idField('ID'),
  })
  .strict();

const productIdParamSchema = z
  .object({
    productId: idField('Product ID'),
  })
  .strict();

const itemIdParamSchema = z
  .object({
    itemId: idField('Item ID'),
  })
  .strict();

const reviewIdParamSchema = z
  .object({
    reviewId: idField('Review ID'),
  })
  .strict();

module.exports = {
  POSTAL_CODE_REGEX,
  MOBILE_REGEX,
  STRONG_PASSWORD_REGEX,
  stringField,
  passwordField,
  numberField,
  idField,
  priceField,
  requireAtLeastOneField,
  otpCodeField,
  emailField,
  phoneField,
  verifyOtpSchema,
  idParamSchema,
  productIdParamSchema,
  itemIdParamSchema,
  reviewIdParamSchema,
};
