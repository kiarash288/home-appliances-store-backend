const express = require('express');
const router = express.Router();

const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { validateParams } = require('../middlewares/validate.middleware');
const { createParamIdSchema } = require('../validators/common.validator');
const {
  createCategorySchema,
  updateCategorySchema,
} = require('../validators/category.validator');
const categoryController = require('../controllers/category.controller');

// ==================== Public Routes ====================
// No authentication required

router.get('/', categoryController.getAllCategories); // Get all categories
router.get(
  '/:id',
  validateParams(createParamIdSchema('id')),
  categoryController.getCategoryById
); // Get category details by ID

// ==================== Admin Routes ====================

router.post(
  '/',
  verifyToken,
  isAdmin,
  validate(createCategorySchema),
  categoryController.createCategory
); // Create a new category
router.put(
  '/:id',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  validate(updateCategorySchema),
  categoryController.updateCategory
); // Update a category
router.delete(
  '/:id',
  verifyToken,
  isAdmin,
  validateParams(createParamIdSchema('id')),
  categoryController.deleteCategory
); // Delete a category

module.exports = router;
