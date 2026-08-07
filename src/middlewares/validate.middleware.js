/**
 * Validation middleware designed for Zod schemas.
 *
 * Usage:
 *   const validate = require('../middlewares/validate.middleware');
 *   const { registerSchema } = require('../validators/auth.validator');
 *
 *   router.post('/register', validate(registerSchema), controller);
 */

/**
 * Higher-order middleware that validates req.body against a Zod schema.
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 */
const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || 'body',
        message: issue.message,
      }));

      return res.status(400).json({
        message: 'Validation failed',
        errors,
      });
    }

    // Replace with parsed/stripped data from Zod
    req.body = result.data;
    next();
  };
};

module.exports = validate;
