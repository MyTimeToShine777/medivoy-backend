/**
 * Standard API response utilities
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {Object} options - Response options
 * @param {String} options.message - Success message
 * @param {Object} options.data - Response data
 * @param {Object} options.pagination - Pagination info (optional)
 * @param {Number} statusCode - HTTP status code (default: 200)
 */
const successResponse = (res, options, statusCode = 200) => {
  const response = {
    success: true,
    message: options.message || 'Success',
    ...(options.data && { data: options.data }),
    ...(options.pagination && { pagination: options.pagination }),
  };

  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {Object} options - Response options
 * @param {String} options.message - Error message
 * @param {String} options.code - Error code (optional)
 * @param {Object} options.error - Error details (optional)
 * @param {Object} options.errors - Validation errors (optional)
 * @param {Number} statusCode - HTTP status code (default: 500)
 */
const errorResponse = (res, options, statusCode = 500) => {
  const response = {
    success: false,
    message: options.message || 'An error occurred',
    ...(options.code && { code: options.code }),
    ...(options.error && { error: options.error }),
    ...(options.errors && { errors: options.errors }),
  };

  return res.status(statusCode).json(response);
};

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {Object} options - Response options
 * @param {String} options.message - Success message
 * @param {Array} options.data - Response data array
 * @param {Object} options.pagination - Pagination info
 * @param {Number} statusCode - HTTP status code (default: 200)
 */
const paginatedResponse = (res, options, statusCode = 200) => {
  const { pagination } = options;

  return res.status(statusCode).json({
    success: true,
    message: options.message || 'Success',
    data: options.data,
    pagination: {
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalRecords: pagination.totalRecords,
      hasNextPage: pagination.currentPage < pagination.totalPages,
      hasPrevPage: pagination.currentPage > 1,
    },
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
};
