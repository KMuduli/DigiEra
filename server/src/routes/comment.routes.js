// DigitalEra - Comment Routes
const express = require('express');
const router = express.Router();
const {
  getCommentsByArticle,
  createComment,
  updateComment,
  deleteComment,
  getAllComments,
  updateCommentStatus,
} = require('../controllers/comment.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { commentSchema } = require('../utils/schemas');

/**
 * @route   GET /api/comments/article/:articleId
 * @desc    Get approved comments for an article
 * @access  Public
 */
router.get('/article/:articleId', getCommentsByArticle);

/**
 * @route   POST /api/comments
 * @desc    Submit a new comment
 * @access  Private (Authenticated Users)
 */
router.post('/', authenticate, validate(commentSchema), createComment);

/**
 * @route   PUT /api/comments/:id
 * @desc    Edit a comment
 * @access  Private (Owner)
 */
router.put('/:id', authenticate, updateComment);

/**
 * @route   DELETE /api/comments/:id
 * @desc    Delete a comment
 * @access  Private (Owner or Admin)
 */
router.delete('/:id', authenticate, deleteComment);

// ==========================================
// ADMIN ROUTES
// ==========================================

/**
 * @route   GET /api/comments/admin
 * @desc    Get all comments for moderation
 * @access  Private (Admin only)
 */
router.get('/admin', authenticate, authorize('ADMIN'), getAllComments);

/**
 * @route   PATCH /api/comments/:id/status
 * @desc    Approve or reject a comment
 * @access  Private (Admin only)
 */
router.patch('/:id/status', authenticate, authorize('ADMIN'), updateCommentStatus);

module.exports = router;
