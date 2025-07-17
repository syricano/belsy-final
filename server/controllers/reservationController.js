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

  let userId = req.user?.id || req.userId || null;
  let guestName = null;
  let guestEmail = null;
  let guestPhone = null;

  // Check duty hours
  const date = new Date(reservationTime);
  const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
  const time = date.toTimeString().slice(0, 5);

  const duty = await Duty.findOne({ where: { dayOfWeek } });
  if (!duty) throw new ErrorResponse(`No working hours set for ${dayOfWeek}`, 400);

  const timeToMinutes = (str) => {
    const [h, m] = str.split(':').map(Number);
    return h * 60 + m;
  };

  const timeMinutes = timeToMinutes(time);
  const startMinutes = timeToMinutes(duty.startTime);
  const endMinutes = timeToMinutes(duty.endTime);

  if (timeMinutes < startMinutes || timeMinutes >= endMinutes) {
    throw new ErrorResponse('Reservation time is outside working hours', 400);
  }

  if (!time.endsWith(':00')) {
    throw new ErrorResponse('Reservation time must be in full-hour blocks (e.g., 13:00)', 400);
  }
  
  // Determine who is booking
  
  // 🟢 Case 1: Normal authenticated user (not admin) booking for themselves
  if (req.user && req.user.role !== 'Admin') {
    userId = req.user.id;

  // 🟢 Case 2: Admin booking for guest or registered user
  } else if (req.user?.role === 'Admin') {
    if (!phone && !name) {
      throw new ErrorResponse('Admin must provide at least a phone number or name to make a booking.', 400);
    }

    // Try to match with an existing user by phone or email
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          ...(phone ? [{ phone }] : []),
          ...(email ? [{ email }] : []),
        ],
      },
    });

    if (existingUser) {
      userId = existingUser.id; // Admin books on behalf of existing user
    } else {
      guestName = name;
      guestEmail = email;
      guestPhone = phone;
    }

  // 🟢 Case 3: Guest (not authenticated)
  } else {
    guestName = name;
    guestEmail = email;
    guestPhone = phone;
  }



  // Avoid duplicate reservation for same time/user/guest
  const existingReservation = await Reservation.findOne({
    where: {
      reservationTime,
      status: { [Op.in]: ['Pending', 'Approved'] },
      ...(userId
        ? { userId }
        : {
            guestEmail,
            guestPhone,
          }),
    },
  });

  if (existingReservation) {
    throw new ErrorResponse('You already have a reservation at this time.', 409);
  }

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

  // Verify table IDs 
  const tables = await Table.findAll({
    where: {
      id: { [Op.in]: tableIds },
    }
  });

  if (tables.length !== tableIds.length) {
    throw new ErrorResponse('Some selected tables are unavailable or invalid', 400);
  }

  const reservationDate = new Date(reservationTime);
  if (reservationDate < new Date()) {
    throw new ErrorResponse('Reservation time cannot be in the past', 400);
  }

  const bufferStart = new Date(reservationDate.getTime() - 90 * 60 * 1000);
  const bufferEnd = new Date(reservationDate.getTime() + 90 * 60 * 1000);

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
    }
    return entries;
  });

  res.status(201).json({
    message: 'Reservation created successfully',
    reservations: newReservations
  });
});

export const getMyReservations = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.userId;
  const where = userId
    ? { userId }
    : { guestEmail: req.query.email, guestPhone: req.query.phone };
    include: [User, { model: Table }];
    

  const reservations = await Reservation.findAll({
    where,
    include: [User, { model: Table }],
    order: [['reservationTime', 'DESC']],
  });

  res.json(reservations);
});

export const getAllReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.findAll({
    include: [User, Table],
    order: [['reservationTime', 'DESC']],
  });
  res.json(reservations);
});

export const approveReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findByPk(req.params.id);
  if (!reservation) throw new ErrorResponse('Reservation not found', 404);

  reservation.status = 'Approved';
  reservation.adminResponse = req.body.adminResponse || 'Approved';
  await reservation.save();

  res.json({ message: 'Reservation approved', reservation });
});

export const declineReservation = asyncHandler(async (req, res) => {
  const target = await Reservation.findByPk(req.params.id);
  if (!target) throw new ErrorResponse('Reservation not found', 404);

  const { reservationTime, userId, guestEmail, guestPhone } = target;
  const isGuest = !userId;

  const relatedReservations = await Reservation.findAll({
    where: {
      reservationTime,
      status: { [Op.in]: ['Pending', 'Approved'] },
      ...(isGuest
        ? { guestEmail, guestPhone }
        : { userId }),
    },
  });

  await sequelize.transaction(async (t) => {
    for (const r of relatedReservations) {
      r.status = 'Declined';
      r.adminResponse = req.body.adminResponse || 'Declined';
      r.tableId = null;
      await r.save({ transaction: t });
    }
  });

  res.json({ message: 'Reservation declined for all related tables.' });
});

export const suggestTables = asyncHandler(async (req, res) => {
  const { guests, reservationTime } = req.body;
  const neededTables = Math.ceil(guests / 2);

  const reservationDate = new Date(reservationTime);
  const bufferStart = new Date(reservationDate.getTime() - 90 * 60 * 1000);
  const bufferEnd = new Date(reservationDate.getTime() + 90 * 60 * 1000);

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
export const updateReservation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { guests, reservationTime, note, adminNote } = req.body;

  const reservation = await Reservation.findByPk(id);
  if (!reservation) throw new ErrorResponse('Reservation not found', 404);

  // Authorization check: check if the user is the owner or an admin
  const isAdmin = req.user?.role === 'Admin';
  const isOwner = reservation.userId === req.user?.id;

  if (!isAdmin && !isOwner) {
    throw new ErrorResponse('You are not authorized to update this reservation', 403);
  }
  const isGuestOwner =
    !reservation.userId &&
    reservation.guestEmail === req.user?.email &&
    reservation.guestPhone === req.user?.phone;

  if (!isAdmin && !isOwner && !isGuestOwner) {
    throw new ErrorResponse('You are not authorized to update this reservation', 403);
  }

  // Validate reservation time is within working hours (this is already in place)
  const date = new Date(reservationTime);
  const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
  const time = date.toTimeString().slice(0, 5);
  const duty = await Duty.findOne({ where: { dayOfWeek } });

  if (!duty) throw new ErrorResponse(`No working hours set for ${dayOfWeek}`, 422);

  const timeToMinutes = (str) => {
    const [h, m] = str.split(':').map(Number);
    return h * 60 + m;
  };

  const timeMinutes = timeToMinutes(time);
  const startMinutes = timeToMinutes(duty.startTime);
  const endMinutes = timeToMinutes(duty.endTime);

  if (timeMinutes < startMinutes || timeMinutes >= endMinutes) {
    throw new ErrorResponse('Reservation time is outside working hours', 422);
  }

  if (!time.endsWith(':00')) {
    throw new ErrorResponse('Reservation time must be in full-hour blocks (e.g., 13:00)', 422);
  }

  // Update the reservation fields
  reservation.guests = guests;
  reservation.reservationTime = reservationTime;
  reservation.note = note;

  if (isAdmin && adminNote) {
    reservation.adminResponse = adminNote;
  }

  await reservation.save();

  res.json({ message: 'Reservation updated successfully', reservation });
});


export const cancelReservation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const reservation = await Reservation.findByPk(id);
  if (!reservation) throw new ErrorResponse('Reservation not found', 404);

  // Check if user is allowed to cancel this reservation
  if (reservation.userId !== req.user?.id && req.user?.role !== 'Admin') {
    throw new ErrorResponse('You are not authorized to cancel this reservation', 403);
  }

  reservation.status = 'Canceled';
  await reservation.save();

  res.json({ message: 'Reservation canceled successfully' });
}); 
