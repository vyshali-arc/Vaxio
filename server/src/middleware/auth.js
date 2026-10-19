import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'vaxio_fallback_jwt_secret_key_2026'
      );

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists or session expired. Please log in again.',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Access denied.',
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Authorization token missing. Access denied.',
    });
  }
};
