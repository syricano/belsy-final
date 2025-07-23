import express from 'express';
import {
  getAddress,
  updateAddress
} from '../controllers/addressController.js';

import verifyToken from '../middleware/verifyToken.js';
import isAdmin from '../middleware/isAdmin.js';
import validateZod from '../middleware/validateZod.js';
import { addressSchema } from '../zod/Schemas.js';

const addressRouter = express.Router();

// Public
addressRouter.get('/', getAddress);

// Admin only
addressRouter.put('/', verifyToken, isAdmin, validateZod(addressSchema), updateAddress);

export default addressRouter;
