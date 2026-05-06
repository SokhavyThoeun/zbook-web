/**
 * Authentication Middleware
 * Verifies JWT tokens and protects routes
 */

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/auth');

/**
 * Middleware to protect routes
 * Verifies JWT token and attaches user ID to request
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login first.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

/**
 * Middleware to check admin role
 * Must be used after authMiddleware
 */
const adminMiddleware = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Alternative names for compatibility
const authenticate = authMiddleware;
const authorize = (role) => {
  return async (req, res, next) => {
    try {
      const User = require('../models/User');
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      if (user.role !== role) {
        return res.status(403).json({
          success: false,
          message: `${role} access required`,
        });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  };
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  authenticate,
  authorize,
};
