import express from 'express';
import {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservation,
  cancelReservation,
  approveReservation,
  declineReservation,
  suggestTables
} from '../controllers/reservationController.js';
import  isAdmin from '../middleware/isAdmin.js';
import  verifyToken from '../middleware/verifyToken.js';
import validateZod from '../middleware/validateZod.js';
import { 
    reservationSchema,
    suggestTablesSchema,
    adminResponseSchema
} from '../zod/Schemas.js';
import optionalAuth from '../middleware/optionalAuth.js'; 

const reservationRouter = express.Router();

// ========== USER ROUTES ==========

// POST /api/reservations — create a new reservation
reservationRouter.post(
  '/',
  verifyToken,
  optionalAuth, // Allow unauthenticated users to create reservations  
  validateZod(reservationSchema),
  createReservation
);

// GET /api/reservations/mine — get current user's reservations
reservationRouter.get('/mine', verifyToken, getMyReservations);

// PATCH /api/reservations/:id — user can update own reservation
reservationRouter.patch('/:id', verifyToken, updateReservation);

// PATCH /api/reservations/:id/cancel — cancel reservation (optional alternative)
reservationRouter.patch('/:id/cancel', verifyToken, cancelReservation);

// POST /api/reservations/suggest-tables — suggest tables by guest count

reservationRouter.post(
  '/suggest-tables',
  optionalAuth,
  validateZod(suggestTablesSchema), 
  suggestTables
);



// ========== ADMIN ROUTES ==========

// GET /api/reservations/admin — list all reservations (admin)
reservationRouter.get('/admin', verifyToken, isAdmin, getAllReservations);

// PATCH /api/reservations/admin/:id/approve — approve reservation
reservationRouter.patch('/admin/:id/approve', verifyToken, isAdmin, validateZod(adminResponseSchema), approveReservation
);
// PATCH /api/reservations/admin/:id/decline — decline reservation
reservationRouter.patch('/admin/:id/decline', verifyToken, isAdmin, validateZod(adminResponseSchema), declineReservation
);
export default reservationRouter;
