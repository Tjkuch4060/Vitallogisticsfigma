import logger from '../utils/logger.js';
import { captureException } from '../utils/sentry.js';

export class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const errorHandler = (err, req, res, next) => {
  let { statusCode = 500, message } = err;

  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    statusCode = 500;
    message = 'Internal Server Error';
  }

  const response = {
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  logger.error('Error:', {
    statusCode,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Capture in Sentry if it's a server error
  if (statusCode >= 500) {
    captureException(err, {
      path: req.path,
      method: req.method,
      query: req.query,
      body: req.body
    });
  }

  res.status(statusCode).json(response);
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
