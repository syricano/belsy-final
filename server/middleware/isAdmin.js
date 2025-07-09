import User from '../models/User.js';

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.userId);

  if (!user || user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access denied – Admins only' });
  }

  next();
};

export default isAdmin;
