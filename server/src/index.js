// DigitalEra - Server Entry Point
const app = require('./app');
const config = require('./config/env');
const logger = require('./config/logger');

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`🚀 DigitalEra server running on port ${PORT}`);
  logger.info(`📚 API Docs at http://localhost:${PORT}/api-docs`);
  logger.info(`🌍 Environment: ${config.nodeEnv}`);
});
