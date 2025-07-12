import Reservation from '../models/Reservation.js';
import Table from '../models/Table.js';
import User from '../models/User.js';
import Duty from '../models/Duty.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// POST /api/reservations — user
export const createReservation = asyncHandler(async (req, res) => {
  const { tableId, reservationTime, note } = req.body;

  const table = await Table.findByPk(tableId);
  if (!table) {
    throw new ErrorResponse('Table not found', 404);
  }

  const date = new Date(reservationTime);
  const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
  const time = date.toTimeString().slice(0, 5);

  const hours = await duty.findOne({ where: { dayOfWeek } });
  if (!hours) {
    throw new ErrorResponse(`No working hours set for ${dayOfWeek}`, 400);
  }

  if (time < hours.startTime || time > hours.endTime) {
    throw new ErrorResponse('Reservation time is outside of working hours', 400);
  }

  const reservation = await Reservation.create({
    userId: req.userId,
    tableId,
    reservationTime,
    note,
    status: 'Pending',
  });

  res.status(201).json(reservation);
});

// GET /api/reservations/mine
export const getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.findAll({
    where: { userId: req.userId },
    include: [Table],
    order: [['reservationTime', 'DESC']],
  });

  res.json(reservations);
});

// GET /api/reservations/admin
export const getAllReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.findAll({
    include: [User, Table],
    order: [['reservationTime', 'DESC']],
  });

  res.json(reservations);
});

// PATCH /api/reservations/admin/:id/approve
export const approveReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findByPk(req.params.id);
  if (!reservation) {
    throw new ErrorResponse('Reservation not found', 404);
  }

  reservation.status = 'Approved';
  reservation.adminResponse = req.body.adminResponse || 'Approved';
  await reservation.save();

  res.json({ message: 'Reservation approved', reservation });
});

// PATCH /api/reservations/admin/:id/decline
export const declineReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findByPk(req.params.id);
  if (!reservation) {
    throw new ErrorResponse('Reservation not found', 404);
  }

  reservation.status = 'Declined';
  reservation.adminResponse = req.body.adminResponse || 'Declined';
  await reservation.save();

  res.json({ message: 'Reservation declined', reservation });
});
