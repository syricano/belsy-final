import authRouter from './authRouter.js';
import adminRouter from './adminRouter.js';
import reservationRouter from './reservationRouter.js';
import dutyRouter from './dutyRouter.js';
import menuRouter from './menuRouter.js';
import tableRouter from './tableRouter.js';
import contactRouter from './contactRouter.js';
import uploadRouter from './uploadRouter.js';
import express from 'express';
import path from 'path';

export const routeMap = [
  { path: '/api/auth', handler: authRouter },
  { path: '/api/admin', handler: adminRouter },
  { path: '/api/reservations', handler: reservationRouter },
  { path: '/api/duty', handler: dutyRouter },
  { path: '/api/menu', handler: menuRouter },
  { path: '/api/tables', handler: tableRouter },
  { path: '/api/contact', handler: contactRouter },
  { path: '/api/upload', handler: uploadRouter },
  { path: '/uploads', handler: express.static(path.resolve('uploads')) }
];