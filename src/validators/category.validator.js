const { z } = require('zod');
const { stringField, idField, requireAtLeastOneField } = require('./common.validator');

/**
 * Category body schemas.
 *
 * Model mapping (src/models/category.js): `parentId` -> `parent_id`.
 * `description` has no column in the Category model yet, so it must be added
 * to the model/migration before controllers can persist it.
 */

const createCategorySchema = z
  .object({
    name: stringField('Name', { min: 2, max: 50 }),
    description: stringField('Description', { min: 1, max: 500 }).optional(),
    // Null explicitly marks a top level category
    parentId: idField('Parent id').nullable().optional(),
  })
  .strict();

const updateCategorySchema = requireAtLeastOneField(createCategorySchema.partial());

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
