// DigitalEra - Category Controller
const prisma = require('../config/db');
const { generateSlug } = require('../utils/slug');

/**
 * @desc   Get all categories
 * @route  GET /api/categories
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { name: 'asc' },
    });
    res.json({ categories });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Get single category by slug
 * @route  GET /api/categories/:slug
 */
const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: { _count: { select: { articles: true } } },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.json({ category });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Create a category
 * @route  POST /api/categories
 */
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const slug = generateSlug(name);

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return res.status(409).json({ error: 'Category already exists.' });
    }

    const category = await prisma.category.create({
      data: { name, slug, description },
    });

    res.status(201).json({ message: 'Category created.', category });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Update a category
 * @route  PUT /api/categories/:id
 */
const updateCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, description } = req.body;

    const data = {};
    if (name) {
      data.name = name;
      data.slug = generateSlug(name);
    }
    if (description !== undefined) data.description = description;

    const category = await prisma.category.update({
      where: { id },
      data,
    });

    res.json({ message: 'Category updated.', category });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Delete a category
 * @route  DELETE /api/categories/:id
 */
const deleteCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const articleCount = await prisma.article.count({ where: { categoryId: id } });
    if (articleCount > 0) {
      return res.status(400).json({
        error: `Cannot delete category. ${articleCount} article(s) are using it.`,
      });
    }

    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Category deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory };
