const { z } = require('zod');
const {
  stringField,
  passwordField,
  requireAtLeastOneField,
} = require('./common.validator');

/**
 * User body schemas.
 *
 * Model mapping (src/models/user.js): `firstName` -> `first_name`,
 * `lastName` -> `last_name`. The role ENUM is stored lower case.
 */

const updateProfileSchema = requireAtLeastOneField(
  z
    .object({
      firstName: stringField('First name', { min: 2, max: 100 }),
      lastName: stringField('Last name', { min: 2, max: 100 }),
    })
    .strict()
    .partial()
);

const changePasswordSchema = z
  .object({
    password: passwordField('Password'),
  })
  .strict();

const changeEmailRequestSchema = z
  .object({
    email: z
      .string({
        error: (issue) =>
          issue.input === undefined ? 'Email is required' : 'Email must be a string',
      })
      .trim()
      .toLowerCase()
      .email({ error: 'Please provide a valid email address' }),
  })
  .strict();

// Admin only endpoint
const updateUserRoleSchema = z
  .object({
    role: z.enum(['admin', 'user'], { error: "Role must be either 'admin' or 'user'" }),
  })
  .strict();

module.exports = {
  updateProfileSchema,
  changePasswordSchema,
  changeEmailRequestSchema,
  updateUserRoleSchema,
};
