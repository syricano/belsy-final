import express from 'express';
import optionalAuth from '../middleware/optionalAuth.js';
import verifyToken from '../middleware/verifyToken.js';
import isAdmin from '../middleware/isAdmin.js';
import validateZod from '../middleware/validateZod.js';
import {
  checkout,
  getMyOrders,
  getOrderById,
  adminListOrders,
  adminUpdateStatus,
  adminUpdatePayment,
  userUpdatePayment
} from '../controllers/orderController.js';
import { checkoutSchema, orderStatusSchema, paymentUpdateSchema, adminPaymentUpdateSchema } from '../zod/Schemas.js';

const orderRouter = express.Router();

// User/guest checkout
orderRouter.post('/checkout', optionalAuth, validateZod(checkoutSchema), checkout);

// Admin endpoints
orderRouter.get('/admin/all', verifyToken, isAdmin, adminListOrders);
orderRouter.patch('/admin/:id/status', verifyToken, isAdmin, validateZod(orderStatusSchema), adminUpdateStatus);
orderRouter.patch('/admin/:id/payment', verifyToken, isAdmin, validateZod(adminPaymentUpdateSchema), adminUpdatePayment);

// Authenticated user orders
orderRouter.get('/', verifyToken, getMyOrders);
orderRouter.get('/:id', verifyToken, getOrderById);
orderRouter.patch('/:id/payment', verifyToken, validateZod(paymentUpdateSchema), userUpdatePayment);

export default orderRouter;
