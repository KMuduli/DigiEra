// DigitalEra - Category Routes
const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { categorySchema } = require('../utils/schemas');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200: { description: Categories list }
 */
router.get('/', getCategories);

/**
 * @swagger
 * /api/categories/{slug}:
 *   get:
 *     summary: Get category by slug
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Category details }
 */
router.get('/:slug', getCategoryBySlug);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a category (admin)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Category created }
 */
router.post('/', authenticate, validate(categorySchema), createCategory);

router.put('/:id', authenticate, validate(categorySchema), updateCategory);
router.delete('/:id', authenticate, deleteCategory);

module.exports = router;
