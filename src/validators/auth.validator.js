const { z } = require('zod');
const {
  stringField,
  passwordField,
  emailField,
  phoneField,
} = require('./common.validator');

const registerSchema = z
  .object({
    firstName: stringField('First name', { min: 2, max: 100 }),
    lastName: stringField('Last name', { min: 2, max: 100 }),
    phone: phoneField,
    email: emailField,
    password: passwordField('Password'),
  })
  .strict();

const loginSchema = z
  .object({
    email: emailField,
    password: passwordField('Password'),
  })
  .strict();

const verifyEmailSchema = z
  .object({
    token: stringField('Token', { min: 10, max: 200 }),
  })
  .strict();

module.exports = {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
};
