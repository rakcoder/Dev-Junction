import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from './asyncHandler.js';

// server/middleware/auth.js

export const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // First check Authorization header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Fallback to cookie
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized. Please log in.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      _id: decoded.id
    };
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid token. Please log in again.');
  }
});