const { z } = require('zod');
const { stringField, passwordField, MOBILE_REGEX } = require('./common.validator');

const registerSchema = z
  .object({
    firstName: stringField('First name', { min: 2, max: 100 }),
    lastName: stringField('Last name', { min: 2, max: 100 }),
    phone: z
      .string({
        required_error: 'Phone number is required',
        invalid_type_error: 'Phone number must be a string',
      })
      .trim()
      .regex(MOBILE_REGEX, {
        message: 'Phone number must start with 09 and contain exactly 11 digits',
      }),
    email: stringField('Email')
      .email({ message: 'Please provide a valid email address' })
      .toLowerCase(),
    password: passwordField('Password'),
  })
  .strict();

const loginSchema = z
  .object({
    email: stringField('Email')
      .email({ message: 'Please provide a valid email address' })
      .toLowerCase(),
    password: passwordField('Password'),
  })
  .strict();



const requestChangeEmailSchema = z
  .object({
    email: stringField('Email')
      .email({ message: 'Please provide a valid email address' })
      .toLowerCase(),
  })
module.exports = {
  registerSchema,
  loginSchema,
};
