import express from 'express';
import {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/menuController.js';

import verifyToken from '../middleware/verifyToken.js';
import isAdmin from '../middleware/isAdmin.js';
import validateZod from '../middleware/validateZod.js';
import { menuSchema, categorySchema } from '../zod/Schemas.js';

const menuRouter = express.Router();

// Public
menuRouter.get('/', getAllMenuItems);

// Admin-only menu routes
menuRouter.post('/', verifyToken, isAdmin, validateZod(menuSchema), createMenuItem);
menuRouter.put('/:id', verifyToken, isAdmin, validateZod(menuSchema), updateMenuItem);
menuRouter.delete('/:id', verifyToken, isAdmin, deleteMenuItem);

// Admin-only category routes
menuRouter.get('/categories', verifyToken, isAdmin, getAllCategories);
menuRouter.post('/categories', verifyToken, isAdmin, validateZod(categorySchema), createCategory);
menuRouter.put('/categories/:id', verifyToken, isAdmin, validateZod(categorySchema), updateCategory);
menuRouter.delete('/categories/:id', verifyToken, isAdmin, deleteCategory);

export default menuRouter;
