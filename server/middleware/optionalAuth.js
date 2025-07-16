import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (user) {
        req.user = user;
      }
    }
    // Continue regardless of whether token exists or is valid
    next();
  } catch (error) {
    // If token is invalid, just continue without setting req.user
    next();
  }
};

export default optionalAuth;