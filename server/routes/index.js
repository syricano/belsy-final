import authRouter from './authRouter.js';
import adminRouter from './adminRouter.js';
import reservationRouter from './reservationRouter.js';
import dutyRouter from './dutyRouter.js';
import menuRouter from './menuRouter.js';
import tableRouter from './tableRouter.js';
import addressRouter from './addressRouter.js';
import uploadRouter from './uploadRouter.js';
import feedbackRouter from './feedbackRouter.js';
import contactRouter from './contactRouter.js';
import cartRouter from './cartRouter.js';
import orderRouter from './orderRouter.js';
import express from 'express';
import path from 'path';
import adminOrderRouter from './orderAdminRouter.js';
import paymentRouter from './paymentRouter.js';


export const routeMap = [
  { path: '/api/auth', handler: authRouter },
  { path: '/api/admin/orders', handler: adminOrderRouter },
  { path: '/api/admin', handler: adminRouter },
  { path: '/api/reservations', handler: reservationRouter },
  { path: '/api/duty', handler: dutyRouter },
  { path: '/api/menu', handler: menuRouter },
  { path: '/api/tables', handler: tableRouter },
  { path: '/api/address', handler: addressRouter },
  { path: '/api/upload', handler: uploadRouter },
  { path: '/api/feedback', handler: feedbackRouter },
  { path: '/api/contact', handler: contactRouter },
  { path: '/api/cart', handler: cartRouter },
  { path: '/api/orders', handler: orderRouter },
  { path: '/api/payments', handler: paymentRouter },
  { path: '/api/admin/orders', handler: adminOrderRouter },
  { path: '/uploads', handler: express.static(path.resolve('uploads')) }
];
