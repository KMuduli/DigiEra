// DigitalEra - Comment Controller
const prisma = require('../config/db');

const getCommentsByArticle = async (req, res, next) => {
  try {
    const articleId = parseInt(req.params.articleId, 10);
    const comments = await prisma.comment.findMany({
      where: { articleId, approved: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ comments });
  } catch (err) {
    next(err);
  }
};

const createComment = async (req, res, next) => {
  try {
    const { content, authorName, authorEmail, articleId } = req.body;
    const comment = await prisma.comment.create({
      data: { content, authorName, authorEmail, articleId },
    });
    res.status(201).json({ message: 'Comment submitted for moderation.', comment });
  } catch (err) {
    next(err);
  }
};

// Admin: get all comments
const getAllComments = async (req, res, next) => {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      include: { article: { select: { id: true, title: true, slug: true } } },
    });
    res.json({ comments });
  } catch (err) {
    next(err);
  }
};

// Admin: approve/reject comment
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

const deleteComment = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.comment.delete({ where: { id } });
    res.json({ message: 'Comment deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCommentsByArticle, createComment, getAllComments, updateCommentStatus, deleteComment };
