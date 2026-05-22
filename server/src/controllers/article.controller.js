// DigitalEra - Article Controller
const prisma = require('../config/db');
const { generateSlug } = require('../utils/slug');
const { getPagination, paginationMeta } = require('../utils/pagination');

/**
 * @desc   Get all published articles (public)
 * @route  GET /api/articles
 */
const getArticles = async (req, res, next) => {
  try {
    const { skip, take, page, limit } = getPagination(req.query);
    const { category, tag, search, sort } = req.query;

    const where = { status: 'PUBLISHED' };

    if (category) {
      where.category = { slug: category };
    }

    if (tag) {
      where.tags = { some: { slug: tag } };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy = sort === 'trending' ? { views: 'desc' } : { publishedAt: 'desc' };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          author: { select: { id: true, name: true, avatar: true } },
          category: { select: { id: true, name: true, slug: true } },
          tags: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.article.count({ where }),
    ]);

    res.json({
      articles,
      pagination: paginationMeta(total, page, limit),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Get all articles for admin (all statuses)
 * @route  GET /api/articles/admin
 */
const getAdminArticles = async (req, res, next) => {
  try {
    const { skip, take, page, limit } = getPagination(req.query);
    const { status, search } = req.query;

    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true } },
          category: { select: { id: true, name: true, slug: true } },
          tags: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.article.count({ where }),
    ]);

    res.json({
      articles,
      pagination: paginationMeta(total, page, limit),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Get single article by slug (public)
 * @route  GET /api/articles/:slug
 */
const getArticleBySlug = async (req, res, next) => {
  try {
    const article = await prisma.article.findUnique({
      where: { slug: req.params.slug },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
        comments: {
          where: { approved: true },
          orderBy: { createdAt: 'desc' },
          select: { id: true, content: true, authorName: true, createdAt: true },
        },
      },
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    // Increment views
    await prisma.article.update({
      where: { id: article.id },
      data: { views: { increment: 1 } },
    });

    res.json({ article });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Get single article by ID (admin)
 * @route  GET /api/articles/admin/:id
 */
const getArticleById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    res.json({ article });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Create a new article
 * @route  POST /api/articles
 */
const createArticle = async (req, res, next) => {
  try {
    const { 
      title, 
      content, 
      excerpt, 
      categoryId, 
      status, 
      metaTitle, 
      metaDesc, 
      tags, 
      featuredImage,
      targetKeywords,
      readingTime 
    } = req.body;

    let slug = generateSlug(title);

    // Ensure unique slug
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    // Connect or create tags
    const tagConnect = tags && tags.length > 0
      ? tags.map((tagName) => ({
          where: { name: tagName },
          create: { name: tagName, slug: generateSlug(tagName) },
        }))
      : [];

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || content.replace(/<[^>]*>/g, '').substring(0, 200),
        categoryId,
        authorId: req.user.id,
        status: status || 'DRAFT',
        metaTitle: metaTitle || title,
        metaDesc: metaDesc || (excerpt || content.replace(/<[^>]*>/g, '').substring(0, 160)),
        featuredImage,
        targetKeywords,
        readingTime,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        tags: { connectOrCreate: tagConnect },
      },
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
    });

    res.status(201).json({ message: 'Article created.', article });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Update an article
 * @route  PUT /api/articles/:id
 */
const updateArticle = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { 
      title, 
      content, 
      excerpt, 
      categoryId, 
      status, 
      metaTitle, 
      metaDesc, 
      tags, 
      featuredImage,
      targetKeywords,
      readingTime 
    } = req.body;

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    const data = {};
    if (title) {
      data.title = title;
      data.slug = generateSlug(title);
      // Check slug uniqueness
      const slugExists = await prisma.article.findFirst({
        where: { slug: data.slug, id: { not: id } },
      });
      if (slugExists) data.slug = `${data.slug}-${Date.now()}`;
    }
    if (content !== undefined) data.content = content;
    if (excerpt !== undefined) data.excerpt = excerpt;
    if (categoryId !== undefined) data.categoryId = categoryId;
    if (metaTitle !== undefined) data.metaTitle = metaTitle;
    if (metaDesc !== undefined) data.metaDesc = metaDesc;
    if (featuredImage !== undefined) data.featuredImage = featuredImage;
    if (targetKeywords !== undefined) data.targetKeywords = targetKeywords;
    if (readingTime !== undefined) data.readingTime = readingTime;
    if (status) {
      data.status = status;
      if (status === 'PUBLISHED' && !existing.publishedAt) {
        data.publishedAt = new Date();
      }
    }

    // Handle tags
    if (tags !== undefined) {
      // Disconnect all existing tags and reconnect
      await prisma.article.update({
        where: { id },
        data: { tags: { set: [] } },
      });

      if (tags.length > 0) {
        data.tags = {
          connectOrCreate: tags.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName, slug: generateSlug(tagName) },
          })),
        };
      }
    }

    const article = await prisma.article.update({
      where: { id },
      data,
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
    });

    res.json({ message: 'Article updated.', article });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Delete an article
 * @route  DELETE /api/articles/:id
 */
const deleteArticle = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    await prisma.article.delete({ where: { id } });
    res.json({ message: 'Article deleted.' });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Get dashboard stats
 * @route  GET /api/articles/stats
 */
const getStats = async (req, res, next) => {
  try {
    const [totalArticles, published, drafts, totalCategories, totalViews, totalComments] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: 'PUBLISHED' } }),
      prisma.article.count({ where: { status: 'DRAFT' } }),
      prisma.category.count(),
      prisma.article.aggregate({ _sum: { views: true } }),
      prisma.comment.count(),
    ]);

    res.json({
      totalArticles,
      published,
      drafts,
      totalCategories,
      totalViews: totalViews._sum.views || 0,
      totalComments,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getArticles,
  getAdminArticles,
  getArticleBySlug,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getStats,
};
