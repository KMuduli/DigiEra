const prisma = require('../config/db');

/**
 * Middleware to log visitor details for every page view and API call.
 */
const visitorLogger = async (req, res, next) => {
  // We only log GET requests to articles/pages or actual relevant API calls
  // to avoid bloating the database with every single asset request.
  const path = req.path;
  
  // Skip common non-logging paths
  if (path.startsWith('/api/admin/visitors') || 
      path.includes('.') || 
      req.method !== 'GET') {
    return next();
  }

  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const method = req.method;
    
    // Try to extract user info from JWT cookie if available
    let loggedInUser = req.user;
    if (!loggedInUser && req.cookies?.token) {
      try {
        const decoded = require('jsonwebtoken').verify(req.cookies.token, require('../config/env').jwt.secret);
        if (decoded && decoded.userId) {
          loggedInUser = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, name: true, email: true }
          });
        }
      } catch (jwtErr) {
        // Silently fail if token is invalid
      }
    }

    // Create log entry as a fire-and-forget (don't block the request)
    prisma.visitorLog.create({
      data: {
        ip: Array.isArray(ip) ? ip[0] : ip,
        userAgent,
        path,
        method,
        userId: loggedInUser ? loggedInUser.id : null,
        name: loggedInUser ? loggedInUser.name : null,
        email: loggedInUser ? loggedInUser.email : null,
        // Optional: Could add ip-geolocation logic here if needed
      }
    }).catch(err => console.error('Visitor log failed:', err));

    next();
  } catch (err) {
    // Invisibility: Middleware should never crash the app
    next();
  }
};

module.exports = visitorLogger;
