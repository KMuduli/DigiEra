// DigitalEra - Tag Controller
const prisma = require('../config/db');
const { generateSlug } = require('../utils/slug');

const getTags = async (req, res, next) => {
  try {
    const tags = await prisma.tag.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { name: 'asc' },
    });
    res.json({ tags });
  } catch (err) {
    next(err);
  }
};

const createTag = async (req, res, next) => {
  try {
    const { name } = req.body;
    const slug = generateSlug(name);

    const existing = await prisma.tag.findUnique({ where: { slug } });
    if (existing) {
      return res.status(409).json({ error: 'Tag already exists.' });
    }

    const tag = await prisma.tag.create({ data: { name, slug } });
    res.status(201).json({ message: 'Tag created.', tag });
  } catch (err) {
    next(err);
  }
};

const deleteTag = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.tag.delete({ where: { id } });
    res.json({ message: 'Tag deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTags, createTag, deleteTag };
