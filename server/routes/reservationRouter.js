import express from 'express';
import {
  createReservation,
  getMyReservations,
  getAllReservations,
  approveReservation,
  declineReservation
} from '../controllers/reservationController.js';
import  isAdmin from '../middleware/isAdmin.js';
import  verifyToken from '../middleware/verifyToken.js';
import validateZod from '../middleware/validateZod.js';
import { reservationSchema } from '../zod/Schemas.js'; 

const reservationRouter = express.Router();

// ========== USER ROUTES ==========

// POST /api/reservations — create a new reservation
reservationRouter.post(
  '/',
  verifyToken,
  validateZod(reservationSchema),
  createReservation
);

// GET /api/reservations/mine — get current user's reservations
reservationRouter.get('/mine', verifyToken, getMyReservations);


// ========== ADMIN ROUTES ==========

// GET /api/reservations/admin — list all reservations (admin)
reservationRouter.get('/admin', verifyToken, isAdmin, getAllReservations);

// PATCH /api/reservations/admin/:id/approve — approve reservation
reservationRouter.patch('/admin/:id/approve', verifyToken, isAdmin, approveReservation);

// PATCH /api/reservations/admin/:id/decline — decline reservation
reservationRouter.patch('/admin/:id/decline', verifyToken, isAdmin, declineReservation);

export default reservationRouter;
