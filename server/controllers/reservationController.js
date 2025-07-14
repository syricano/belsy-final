import Reservation from '../models/Reservation.js';
import Table from '../models/Table.js';
import User from '../models/User.js';
import Duty from '../models/Duty.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import sequelize from '../db/index.js';
import { Op } from 'sequelize';

// POST /api/reservations — user
export const createReservation = asyncHandler(async (req, res) => {
  const {
    tableIds,
    reservationTime,
    guests,
    note,
    name,
    email,
    phone
  } = req.body;

  let userId = req.userId;
  let guestName = null;
  let guestEmail = null;
  let guestPhone = null;

  // Check duty hours
  const date = new Date(reservationTime);
  const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
  const time = date.toTimeString().slice(0, 5);

  const duty = await Duty.findOne({ where: { dayOfWeek } });
  if (!duty) throw new ErrorResponse(`No working hours set for ${dayOfWeek}`, 400);
  if (time < duty.startTime || time > duty.endTime) {
    throw new ErrorResponse('Reservation time is outside of working hours', 400);
  }

  // Admin booking for user or guest
  if (req.user?.role === 'Admin') {
    if (email || phone) {
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { phone }]
        }
      });

      if (existingUser) {
        userId = existingUser.id;
      } else {
        userId = null;
        guestName = name;
        guestEmail = email;
        guestPhone = phone;
      }
    }
  }

  // Abuse protection — count total active reservations for the user
  if (userId !== null && userId !== undefined) {
    const activeCount = await Reservation.count({
      where: {
        userId,
        status: { [Op.in]: ['Pending', 'Approved'] },
      },
    });

    if (activeCount >= 10) {
      throw new ErrorResponse('Too many active reservations', 429);
    }
  }

  // Verify each table exists & is not already reserved
  const tables = await Table.findAll({
    where: {
      id: { [Op.in]: tableIds },
      isAvailable: true
    }
  });

  if (tables.length !== tableIds.length) {
    throw new ErrorResponse('Some selected tables are unavailable or invalid', 400);
  }

  // Check for conflicts for each table within a 1.5-hour range
  const reservationDate = new Date(reservationTime);
  if (reservationDate < new Date()) {
    throw new ErrorResponse('Reservation time cannot be in the past', 400);
  }
  const bufferStart = new Date(reservationDate.getTime() - 90 * 60 * 1000); // -1.5h
  const bufferEnd = new Date(reservationDate.getTime() + 90 * 60 * 1000);  // +1.5h

  const conflicts = await Reservation.findAll({
    where: {
      tableId: { [Op.in]: tableIds },
      reservationTime: {
        [Op.between]: [bufferStart, bufferEnd]
      },
      status: { [Op.ne]: 'Declined' }
    }
  });

  if (conflicts.length > 0) {
    throw new ErrorResponse('One or more selected tables are already reserved at this time', 409);
  }

  // ✅ Create reservations inside a transaction
  const newReservations = await sequelize.transaction(async (t) => {
    const entries = [];
    for (const tableId of tableIds) {
      const entry = await Reservation.create(
        {
          userId,
          tableId,
          reservationTime,
          note,
          guests,
          guestName,
          guestEmail,
          guestPhone,
          status: 'Pending'
        },
        { transaction: t }
      );
      entries.push(entry);

      // Mark the table unavailable
      await Table.update({ isAvailable: false }, {
        where: { id: tableId },
        transaction: t
      });
    }
    return entries;
  });

  res.status(201).json({
    message: 'Reservation created successfully',
    reservations: newReservations
  });
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

  const tableIdToFree = reservation.tableId;

  reservation.status = 'Declined';
  reservation.adminResponse = req.body.adminResponse || 'Declined';
  reservation.tableId = null;
  await reservation.save();

  if (tableIdToFree) {
    const table = await Table.findByPk(tableIdToFree);
    if (table) {
      table.isAvailable = true;
      await table.save();
    }
  }

  res.json({ message: 'Reservation declined', reservation });
});

// POST /api/reservations/suggest
export const suggestTables = asyncHandler(async (req, res) => {
  const { guests, reservationTime } = req.body;
  const neededTables = Math.ceil(guests / 2);

  const reservationDate = new Date(reservationTime);
  const bufferStart = new Date(reservationDate.getTime() - 90 * 60 * 1000); // -1.5h
  const bufferEnd = new Date(reservationDate.getTime() + 90 * 60 * 1000);  // +1.5h

  // Step 1: Find reserved tables at that time
  const conflicts = await Reservation.findAll({
    where: {
      reservationTime: {
        [Op.between]: [bufferStart, bufferEnd]
      },
      status: { [Op.ne]: 'Declined' }
    },
    attributes: ['tableId']
  });

  const reservedIds = conflicts.map((r) => r.tableId);

  // Step 2: Find available tables
  const availableTables = await Table.findAll({
    where: {
      isAvailable: true,
      id: { [Op.notIn]: reservedIds }
    },
    order: [['number', 'ASC']]
  });

  if (availableTables.length < neededTables) {
    throw new ErrorResponse(
      `Only ${availableTables.length} table(s) available — not enough for ${guests} guests.`,
      400
    );
  }

  const suggested = availableTables.slice(0, neededTables);

  res.status(200).json({
    tables: suggested.map((t) => t.id),
    tablesCount: suggested.length
  });
});
