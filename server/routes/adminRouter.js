import {Router} from 'express';
import verifyToken from '../middleware/verifyToken.js';
import isAdmin from '../middleware/isAdmin.js';

const adminRouter = Router();

adminRouter.get('/dashboard', (req, res) => {
  res.status(200).json({ message: '👑 Welcome to the Admin Dashboard!' });
});

export default adminRouter;
