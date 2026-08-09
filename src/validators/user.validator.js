const { z } = require('zod');
const {
  stringField,
  passwordField,
  requireAtLeastOneField,
  otpCodeField,
  emailField,
  phoneField,
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

const requestPasswordResetSchema = z
  .object({
    email: emailField,
  })
  .strict();

const verifyPasswordResetSchema = z
  .object({
    email: emailField,
    otp: otpCodeField,
    newPassword: passwordField('New password'),
  })
  .strict();

const changeEmailRequestSchema = z
  .object({
    email: emailField,
  })
  .strict();

const verifyChangeEmailSchema = z
  .object({
    email: emailField,
    otp: otpCodeField,
  })
  .strict();

const requestChangePhoneSchema = z
  .object({
    phone: phoneField,
  })
  .strict();

const verifyChangePhoneSchema = z
  .object({
    phone: phoneField,
    otp: otpCodeField,
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
  requestPasswordResetSchema,
  verifyPasswordResetSchema,
  changeEmailRequestSchema,
  verifyChangeEmailSchema,
  requestChangePhoneSchema,
  verifyChangePhoneSchema,
  updateUserRoleSchema,
};
