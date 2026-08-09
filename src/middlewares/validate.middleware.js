/**
 * Validation middleware designed for Zod schemas.
 *
 * Usage:
 *   const validate = require('../middlewares/validate.middleware');
 *   const { validateParams } = require('../middlewares/validate.middleware');
 *   const { registerSchema } = require('../validators/auth.validator');
 *
 *   router.post('/register', validate(registerSchema), controller);
 *   router.get('/:id', validateParams(createParamIdSchema('id')), controller);
 */

function formatZodErrors(error) {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'value',
    message: issue.message,
  }));
}

/**
 * Higher-order middleware that validates req.body against a Zod schema.
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 */
const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: formatZodErrors(result.error),
      });
    }

    req.body = result.data;
    next();
  };
};

/**
 * Higher-order middleware that validates req.params against a Zod schema.
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: formatZodErrors(result.error),
      });
    }

    // Merge so route params stay available; coerce types (e.g. string id -> number)
    req.params = { ...req.params, ...result.data };
    next();
  };
};

module.exports = validate;
module.exports.validateParams = validateParams;
