import express from 'express';
import {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menuController.js';

import verifyToken from '../middleware/verifyToken.js';
import isAdmin from '../middleware/isAdmin.js';
import validateZod from '../middleware/validateZod.js';
import { menuSchema } from '../zod/Schemas.js';

const menuRouter = express.Router();

// Public
menuRouter.get('/', getAllMenuItems);

// Admin-only routes
menuRouter.post('/', verifyToken, isAdmin, validateZod(menuSchema), createMenuItem);
menuRouter.put('/:id', verifyToken, isAdmin, validateZod(menuSchema), updateMenuItem);
menuRouter.delete('/:id', verifyToken, isAdmin, deleteMenuItem);

export default menuRouter;
