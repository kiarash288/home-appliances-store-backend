const { z } = require('zod');
const { stringField, passwordField } = require('./common.validator');

const registerSchema = z
  .object({
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

module.exports = {
  registerSchema,
  loginSchema,
};
