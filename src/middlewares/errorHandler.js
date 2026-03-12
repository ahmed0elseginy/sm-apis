const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const config = require('../config');

const handlePrismaError = (err) => {
  if (err.code === 'P2002') {
    const target = err.meta?.target?.[0] || 'field';
    return new ApiError(409, `${target} already exists`);
  }
  if (err.code === 'P2025') {
    return new ApiError(404, 'Record not found');
  }
  if (err.code === 'P2003') {
    return new ApiError(400, 'Invalid reference');
  }
  return null;
};

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (err.name === 'ZodError') {
    const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    error = new ApiError(400, messages.join('; '));
  }

  if (err.name?.includes('Prisma')) {
    const prismaError = handlePrismaError(err);
    if (prismaError) error = prismaError;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  const statusCode = error.statusCode || 500;
  const message =
    config.env === 'production'
      ? 'Internal server error'
      : error.message || 'Internal server error';

  logger.error(`[${req.method}] ${req.path} >> ${error.message}`, {
    stack: error.stack,
  });

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
