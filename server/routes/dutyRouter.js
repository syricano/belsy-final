import express from 'express';
import {
  getAllDuties,
  createDuty,
  updateDuty,
  deleteDuty
} from '../controllers/dutyController.js';

import { verifyToken, isAdmin } from '../middleware/auth.js';
import validateZod from '../middleware/validateZod.js';
import { dutySchema } from '../validators/Schemas.js';

const dutyRouter = express.Router();

// GET /api/working-hours — Public/Admin
dutyRouter.get('/', getAllDuties);

// POST /api/working-hours — Admin only
dutyRouter.post('/', verifyToken, isAdmin, validateZod(dutySchema), createDuty);

// PUT /api/working-hours/:id — Admin only
dutyRouter.put('/:id', verifyToken, isAdmin, validateZod(DutySchema), updateDuty);

// DELETE /api/working-hours/:id — Admin only
dutyRouter.delete('/:id', verifyToken, isAdmin, deleteDuty);

export default dutyRouter;
