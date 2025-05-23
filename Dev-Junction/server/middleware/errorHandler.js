import { ApiError } from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // Production error response
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      // Don't leak error details in production
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
      });
    }
  }
};