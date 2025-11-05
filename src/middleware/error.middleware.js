const logger = require('../utils/logger');
const { errorResponse } = require('../utils/response');
const config = require('../config');

/**
 * Global error handling middleware
 */
const errorMiddleware = (err, req, res, next) => {
  // Log error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    user: req.user?.email || 'anonymous',
  });

  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || null;

  // Handle specific error types

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = 'Validation error';
    errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'Resource already exists';
    errors = err.errors.map((e) => ({
      field: e.path,
      message: `${e.path} must be unique`,
    }));
  }

  // Sequelize foreign key constraint errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Invalid reference to related resource';
  }

  // Sequelize database errors
  if (err.name === 'SequelizeDatabaseError') {
    statusCode = 500;
    message = 'Database error occurred';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  }

  // Multer file upload errors
  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size exceeds limit';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files';
    } else {
      message = 'File upload error';
    }
  }

  // MongoDB errors
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    statusCode = 500;
    message = 'Database error occurred';

    if (err.code === 11000) {
      statusCode = 409;
      message = 'Duplicate entry';
      const field = Object.keys(err.keyPattern)[0];
      errors = [{ field, message: `${field} already exists` }];
    }
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    message = 'Validation error';
    errors = Object.keys(err.errors).map((key) => ({
      field: key,
      message: err.errors[key].message,
    }));
  }

  // Mongoose cast errors
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Send error response
  return errorResponse(
    res,
    {
      message,
      code: err.code || 'INTERNAL_ERROR',
      ...(config.env === 'development' && {
        error: err.message,
        stack: err.stack,
      }),
      ...(errors && errors.length > 0 && { errors }),
    },
    statusCode
  );
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) =>
  errorResponse(
    res,
    {
      message: `Route ${req.method} ${req.originalUrl} not found`,
      code: 'ROUTE_NOT_FOUND',
    },
    404
  );

module.exports = {
  errorMiddleware,
  notFoundHandler,
};
