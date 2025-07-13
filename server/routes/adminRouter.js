import {Router} from 'express';
import verifyToken from '../middleware/verifyToken.js';
import isAdmin from '../middleware/isAdmin.js';
import validateZod from '../middleware/validateZod.js';
import { userRoleSchema } from '../zod/Schemas.js';

import {
  getAllUsers,
  getUserById,
  updateUserRole
} from '../controllers/auth.js';

const adminRouter = Router();

adminRouter.get('/dashboard', (req, res) => {
  res.status(200).json({ message: '👑 Welcome to the Admin Dashboard!' });
});

adminRouter.get('/users', verifyToken, isAdmin, getAllUsers);
adminRouter.get('/users/:id', verifyToken, isAdmin, getUserById);
adminRouter.put('/users/:id/role', verifyToken, isAdmin, validateZod(userRoleSchema), updateUserRole);

export default adminRouter;
