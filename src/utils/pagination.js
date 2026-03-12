const config = require('../config');

/**
 * Get pagination params from query string
 * @param {Object} query - Express request query
 * @returns {{ skip: number, take: number, page: number, limit: number }}
 */
function getPaginationParams(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(
    config.pagination.maxLimit,
    Math.max(1, parseInt(query.limit, 10) || config.pagination.defaultLimit)
  );
  const skip = (page - 1) * limit;

  return { skip, take: limit, page, limit };
}

/**
 * Build pagination metadata for response
 * @param {number} total - Total count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object}
 */
function buildPaginationMeta(total, page, limit) {
  const totalPages = Math.ceil(total / limit) || 1;
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    total,
    page,
    limit,
    totalPages,
    hasNext,
    hasPrev,
  };
}

module.exports = {
  getPaginationParams,
  buildPaginationMeta,
};
