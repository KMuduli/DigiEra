// DigitalEra - Server Entry Point
const app = require('./app');
const config = require('./config/env');
const logger = require('./config/logger');

const PORT = config.port;

// Only start server if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    logger.info(`🚀 DigitalEra server running on port ${PORT}`);
    logger.info(`📚 API Docs at http://localhost:${PORT}/api-docs`);
    logger.info(`🌍 Environment: ${config.nodeEnv}`);
  });
}

module.exports = app;
