// DigitalEra - Express Application Setup
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const config = require('./config/env');
const { errorHandler, notFound } = require('./middleware/error');
const visitorLogger = require('./middleware/visitorLogger');

// Route imports
const authRoutes = require('./routes/auth.routes');
const articleRoutes = require('./routes/article.routes');
const categoryRoutes = require('./routes/category.routes');
const tagRoutes = require('./routes/tag.routes');
const uploadRoutes = require('./routes/upload.routes');
const commentRoutes = require('./routes/comment.routes');
const pageRoutes = require('./routes/page.routes');
const visitorRoutes = require('./routes/visitor.routes');

const app = express();

// Required for Vercel/proxies to correctly handle IP-based rate limiting
app.set('trust proxy', 1);

// ─── Security Middleware ───
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));

// ─── Rate Limiting ───
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ─── Body Parsing ───
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Logging ───
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// ─── Static Files ───
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── API Documentation ───
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'DigitalEra API Docs',
}));

// ─── Health check ───
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV });
});

// ─── Global Visitor Tracking ───
app.use(visitorLogger);

// ─── Regular Routes ───
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/visitors', visitorRoutes);

// ─── Error Handling ───
app.use(notFound);
app.use(errorHandler);

module.exports = app;
