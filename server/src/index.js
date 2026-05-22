const app = require('./app');
const config = require('./config/env');
const logger = require('./config/logger');

const PORT = config.port || 5000;

// Only start server if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    logger.info(`🚀 DigitalEra server running on port ${PORT}`);
    logger.info(`🌍 Environment: ${config.nodeEnv}`);
  });
}

module.exports = app;
