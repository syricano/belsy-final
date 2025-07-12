import express from 'express';
import {
  getAllDuties,
  createDuty,
  updateDuty,
  deleteDuty
} from '../controllers/dutyController.js';

import verifyToken from '../middleware/verifyToken.js';
import isAdmin from '../middleware/isAdmin.js';
import validateZod from '../middleware/validateZod.js';
import { dutySchema } from '../zod/Schemas.js';

const dutyRouter = express.Router();

// GET /api/duty — Public/Admin
dutyRouter.get('/', getAllDuties);

// POST /api/duty — Admin only
dutyRouter.post('/', verifyToken, isAdmin, validateZod(dutySchema), createDuty);

// PUT /api/duty/:id — Admin only
dutyRouter.put('/:id', verifyToken, isAdmin, validateZod(dutySchema), updateDuty);

// DELETE /api/duty/:id — Admin only
dutyRouter.delete('/:id', verifyToken, isAdmin, deleteDuty);

export default dutyRouter;
