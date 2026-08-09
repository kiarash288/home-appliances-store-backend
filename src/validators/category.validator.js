const { z } = require('zod');
const { stringField, idField, requireAtLeastOneField } = require('./common.validator');

/**
 * Category body schemas.
 *
 * Model mapping (src/models/category.js): `parentId` -> `parent_id`.
 */

const categoryShape = {
  name: stringField('Name', { min: 2, max: 50 }),
  description: stringField('Description', { min: 1, max: 500 }).optional(),
  // Null explicitly marks a top-level category
  parentId: idField('Parent id').nullable().optional(),
};

const createCategorySchema = z.object(categoryShape).strict();

const updateCategorySchema = requireAtLeastOneField(
  z.object(categoryShape).strict().partial()
);

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
