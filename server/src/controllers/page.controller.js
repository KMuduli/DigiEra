const prisma = require('../config/db');

const getPageBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const page = await prisma.page.findUnique({ where: { slug } });
    if (!page) {
      return res.status(404).json({ error: 'Page not found.' });
    }
    res.json({ page });
  } catch (err) {
    next(err);
  }
};

const getAllPages = async (req, res, next) => {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ pages });
  } catch (err) {
    next(err);
  }
};

const upsertPage = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { title, content } = req.body;
    
    const page = await prisma.page.upsert({
      where: { slug },
      update: { title, content },
      create: { title, slug, content }
    });
    res.json({ message: 'Page saved successfully.', page });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPageBySlug, getAllPages, upsertPage };
