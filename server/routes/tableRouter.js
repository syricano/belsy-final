import express from 'express';
import {
  getAllTables,
  createTable,
  updateTable,
  deleteTable
} from '../controllers/tableController.js';

import verifyToken from '../middleware/verifyToken.js';
import isAdmin from '../middleware/isAdmin.js';
import validateZod from '../middleware/validateZod.js';
import { tableSchema } from '../zod/Schemas.js';

const tableRouter = express.Router();

tableRouter.get('/', getAllTables);
tableRouter.post('/', verifyToken, isAdmin, validateZod(tableSchema), createTable);
tableRouter.put('/:id', verifyToken, isAdmin, validateZod(tableSchema), updateTable);
tableRouter.delete('/:id', verifyToken, isAdmin, deleteTable);

export default tableRouter;
