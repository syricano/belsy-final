import express from 'express';
import {
  getContactInfo,
  updateContactInfo
} from '../controllers/contactController.js';

import verifyToken from '../middleware/verifyToken.js';
import isAdmin from '../middleware/isAdmin.js';
import validateZod from '../middleware/validateZod.js';
import { contactInfoSchema } from '../zod/Schemas.js';

const contactRouter = express.Router();

// Public
contactRouter.get('/', getContactInfo);

// Admin only
contactRouter.put('/', verifyToken, isAdmin, validateZod(contactInfoSchema), updateContactInfo);

export default contactRouter;
