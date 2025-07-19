import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const optionalAuth = async (req, res, next) => {
  const cookieToken = req.cookies?.token;
  const headerToken = req.headers.authorization?.split(' ')[1];
  const token = cookieToken || headerToken;

  if (!token) {
    return next(); // Guest user
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (user) {
      req.userId = user.id;
      req.user = user;
    }
  } catch (err) {
    console.warn('⚠️ optionalAuth: Invalid token:', err.message);
    // continue silently as guest
  }

  next();
};

export default optionalAuth;
