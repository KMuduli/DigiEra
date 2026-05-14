// DigitalEra - Comment Controller
const prisma = require('../config/db');

/**
 * @desc    Get comments for a specific article
 * @route   GET /api/comments/article/:articleId
 */
const getCommentsByArticle = async (req, res, next) => {
  try {
    const articleId = parseInt(req.params.articleId, 10);
    const comments = await prisma.comment.findMany({
      where: { articleId, approved: true },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, avatar: true }
        }
      }
    });
    res.json({ comments });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new comment
 * @route   POST /api/comments
 * @access  Private (Authenticated Users)
 */
const createComment = async (req, res, next) => {
  try {
    const { content, articleId } = req.body;
    const userId = req.user.id; // From Auth Middleware

    if (!content || !articleId) {
      return res.status(400).json({ error: 'Content and articleId are required.' });
    }

    const comment = await prisma.comment.create({
      data: { 
        content, 
        articleId: parseInt(articleId, 10),
        userId: userId
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } }
      }
    });

    res.status(201).json({ message: 'Comment posted successfully.', comment });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update a comment (Owner only)
 * @route   PUT /api/comments/:id
 * @access  Private (Owner)
 */
const updateComment = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { content } = req.body;
    const userId = req.user.id;

    const existingComment = await prisma.comment.findUnique({ where: { id } });

    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    // Check ownership
    if (existingComment.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You are not authorized to edit this comment.' });
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    res.json({ message: 'Comment updated successfully.', comment });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a comment (Owner or Admin)
 * @route   DELETE /api/comments/:id
 * @access  Private (Owner or Admin)
 */
const deleteComment = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = req.user.id;

    const existingComment = await prisma.comment.findUnique({ where: { id } });

    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    // Check ownership or Admin role
    if (existingComment.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You are not authorized to delete this comment.' });
    }

    await prisma.comment.delete({ where: { id } });
    res.json({ message: 'Comment deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

// Admin: get all global comments for moderation
const getAllComments = async (req, res, next) => {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      include: { 
        article: { select: { id: true, title: true, slug: true } },
        user: { select: { id: true, name: true, email: true } }
      },
    });
    res.json({ comments });
  } catch (err) {
    next(err);
  }
};

// Admin: toggle approval status
const updateCommentStatus = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { approved } = req.body;
    const comment = await prisma.comment.update({
      where: { id },
      data: { approved },
    });
    res.json({ message: `Comment ${approved ? 'approved' : 'rejected'}.`, comment });
  } catch (err) {
    next(err);
  }
};

module.exports = { 
  getCommentsByArticle, 
  createComment, 
  updateComment,
  deleteComment,
  getAllComments, 
  updateCommentStatus 
};
