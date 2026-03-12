require('dotenv').config();
const app = require('./app');
const config = require('./config');
const logger = require('./config/logger');

const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port} (${config.env})`);
  logger.info(`API: http://localhost:${config.port}${config.apiPrefix}`);
  logger.info(`Swagger: http://localhost:${config.port}/api-docs`);
});

const gracefulShutdown = () => {
  logger.info('Received shutdown signal');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
