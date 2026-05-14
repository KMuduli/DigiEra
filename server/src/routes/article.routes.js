// DigitalEra - Article Routes
const express = require('express');
const router = express.Router();
const {
  getArticles,
  getAdminArticles,
  getArticleBySlug,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getStats,
} = require('../controllers/article.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createArticleSchema, updateArticleSchema } = require('../utils/schemas');

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Get all published articles (public)
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: Paginated articles list }
 */
router.get('/', getArticles);

/**
 * @swagger
 * /api/articles/stats:
 *   get:
 *     summary: Get dashboard statistics (admin)
 *     tags: [Articles]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Dashboard stats }
 */
router.get('/stats', authenticate, authorize('ADMIN'), getStats);

/**
 * @swagger
 * /api/articles/admin:
 *   get:
 *     summary: Get all articles for admin
 *     tags: [Articles]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: All articles }
 */
router.get('/admin', authenticate, authorize('ADMIN'), getAdminArticles);

/**
 * @swagger
 * /api/articles/admin/{id}:
 *   get:
 *     summary: Get article by ID (admin)
 *     tags: [Articles]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Article details }
 */
router.get('/admin/:id', authenticate, authorize('ADMIN'), getArticleById);

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Create a new article
 *     tags: [Articles]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content, categoryId]
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               excerpt: { type: string }
 *               categoryId: { type: integer }
 *               status: { type: string, enum: [DRAFT, PUBLISHED] }
 *               tags: { type: array, items: { type: string } }
 *     responses:
 *       201: { description: Article created }
 */
router.post('/', authenticate, authorize('ADMIN'), validate(createArticleSchema), createArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Update an article
 *     tags: [Articles]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Article updated }
 */
router.put('/:id', authenticate, authorize('ADMIN'), validate(updateArticleSchema), updateArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Delete an article
 *     tags: [Articles]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Article deleted }
 */
router.delete('/:id', authenticate, authorize('ADMIN'), deleteArticle);

/**
 * @swagger
 * /api/articles/{slug}:
 *   get:
 *     summary: Get article by slug (public)
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Article details }
 */
router.get('/:slug', getArticleBySlug);

module.exports = router;
