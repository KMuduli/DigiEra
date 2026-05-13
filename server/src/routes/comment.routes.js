// DigitalEra - Comment Routes
const express = require('express');
const router = express.Router();
const {
  getCommentsByArticle,
  createComment,
  getAllComments,
  updateCommentStatus,
  deleteComment,
} = require('../controllers/comment.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { commentSchema } = require('../utils/schemas');

/**
 * @swagger
 * /api/comments/article/{articleId}:
 *   get:
 *     summary: Get approved comments for an article
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Comments list }
 */
router.get('/article/:articleId', getCommentsByArticle);

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Submit a new comment (public)
 *     tags: [Comments]
 *     responses:
 *       201: { description: Comment submitted for moderation }
 */
router.post('/', validate(commentSchema), createComment);

// Admin routes
router.get('/admin', authenticate, getAllComments);
router.patch('/:id/status', authenticate, updateCommentStatus);
router.delete('/:id', authenticate, deleteComment);

module.exports = router;
