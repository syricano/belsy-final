import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import isAdmin from '../middleware/isAdmin.js';
import validateZod from '../middleware/validateZod.js';
import {
  adminListOrders,
  adminUpdatePayment,
  adminUpdateStatus,
  getOrderById
} from '../controllers/orderController.js';
import { orderStatusSchema, adminPaymentUpdateSchema } from '../zod/Schemas.js';

const adminOrderRouter = express.Router();

adminOrderRouter.use(verifyToken, isAdmin);

adminOrderRouter.get('/', adminListOrders);
adminOrderRouter.get('/:id', getOrderById);
adminOrderRouter.patch('/:id/status', validateZod(orderStatusSchema), adminUpdateStatus);
adminOrderRouter.patch('/:id/payment', validateZod(adminPaymentUpdateSchema), adminUpdatePayment);

export default adminOrderRouter;
