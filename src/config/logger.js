const winston = require('winston');
const config = require('./index');

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: config.env === 'production' ? 'info' : 'debug',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
  ],
});

if (config.env === 'production') {
  const path = require('path');
  const logsDir = path.join(process.cwd(), 'logs');
  try {
    require('fs').mkdirSync(logsDir, { recursive: true });
    logger.add(
      new winston.transports.File({ filename: path.join(logsDir, 'error.log'), level: 'error' })
    );
    logger.add(
      new winston.transports.File({ filename: path.join(logsDir, 'combined.log') })
    );
  } catch (err) {
    console.warn('Could not create logs directory:', err.message);
  }
}

module.exports = logger;
