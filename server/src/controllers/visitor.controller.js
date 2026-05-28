const prisma = require('../config/db');
const { getPagination, paginationMeta } = require('../utils/pagination');

/**
 * @desc   Get all visitor logs for admin
 * @route  GET /api/admin/visitors
 */
const getVisitors = async (req, res, next) => {
  try {
    const { skip, take, page, limit } = getPagination(req.query);
    const { startDate, endDate } = req.query;

    let whereClause = {};
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Inclusion of the entire end day
        whereClause.createdAt.lte = end;
      }
    }
    
    const [visitors, total] = await Promise.all([
      prisma.visitorLog.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.visitorLog.count({ where: whereClause }),
    ]);

    res.json({
      visitors,
      pagination: paginationMeta(total, page, limit),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Get specific visitor stats
 * @route  GET /api/admin/visitors/stats
 */
const getVisitorStats = async (req, res, next) => {
  try {
    const totalVisits = await prisma.visitorLog.count();
    const uniqueIps = await prisma.visitorLog.groupBy({
      by: ['ip'],
      _count: true
    });

    res.json({
      totalVisits,
      uniqueVisitors: uniqueIps.length,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getVisitors,
  getVisitorStats
};
