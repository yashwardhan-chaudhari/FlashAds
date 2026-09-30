import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to protect routes and authenticate requests via JWT
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from 'Bearer <token>'
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'flashads_jwt_secret_dev_key_2026'
      );

      // Fetch user from database
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists',
          code: 'USER_NOT_FOUND',
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Account has been deactivated. Please contact support.',
          code: 'ACCOUNT_DEACTIVATED',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('JWT Verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed or expired',
        code: 'INVALID_TOKEN',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
      code: 'NO_TOKEN',
    });
  }
};

/**
 * Middleware to restrict route access to specific roles
 * @param  {...string} roles - e.g. 'admin', 'advertiser', 'client'
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user?.role}' is not authorized to access this resource`,
        code: 'FORBIDDEN_ROLE',
      });
    }
    next();
  };
};
