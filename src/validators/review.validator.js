const { z } = require('zod');
const { stringField, numberField, requireAtLeastOneField } = require('./common.validator');

/**
 * Review body schemas.
 *
 * Model mapping (src/models/Review.js): `isApproved` -> `is_approved`. The item
 * comes from the route param and the author from the access token, so neither is
 * accepted from the body.
 */

const createReviewSchema = z
  .object({
    rating: numberField('Rating').pipe(
      z
        .number()
        .int({ error: 'Rating must be an integer' })
        .min(1, { error: 'Rating must be at least 1' })
        .max(5, { error: 'Rating must be at most 5' })
    ),
    comment: stringField('Comment', { min: 3, max: 1000 }).optional(),
  })
  .strict();

const updateReviewSchema = requireAtLeastOneField(createReviewSchema.partial());

// Admin moderation endpoint
const updateReviewStatusSchema = z
  .object({
    isApproved: z.boolean({ error: 'isApproved must be true or false' }),
  })
  .strict();

module.exports = {
  createReviewSchema,
  updateReviewSchema,
  updateReviewStatusSchema,
};
