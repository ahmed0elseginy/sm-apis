const { PrismaClient } = require('@prisma/client');
const logger = require('../config/logger');

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['error'],
});

prisma.$connect().catch((err) => {
  logger.error('Failed to connect to database:', err);
  process.exit(1);
});

module.exports = prisma;
