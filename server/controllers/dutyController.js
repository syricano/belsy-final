import Duty from '../models/Duty.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// GET /api/duty-hours — Public or Admin
export const getAllDuties = asyncHandler(async (req, res) => {
  const hours = await Duty.findAll({ order: [['id', 'ASC']] });
  res.json(hours);
});

// POST /api/duty-hours — Admin only
export const createDuty = asyncHandler(async (req, res) => {
  const { dayOfWeek, startTime, endTime } = req.body;

  const exists = await Duty.findOne({ where: { dayOfWeek } });
  if (exists) {
    throw new ErrorResponse('Working hours for this day already exist', 400);
  }

  const newEntry = await Duty.create({ dayOfWeek, startTime, endTime });
  res.status(201).json(newEntry);
});

// PUT /api/duty-hours/:id — Admin only
export const updateDuty = asyncHandler(async (req, res) => {
  const hours = await Duty.findByPk(req.params.id);
  if (!hours) {
    throw new ErrorResponse('Working hours not found', 404);
  }

  await hours.update(req.body);
  res.json(hours);
});

// DELETE /api/duty-hours/:id — Admin only
export const deleteDuty = asyncHandler(async (req, res) => {
  const hours = await Duty.findByPk(req.params.id);
  if (!hours) {
    throw new ErrorResponse('Working hours not found', 404);
  }

  await hours.destroy();
  res.json({ message: 'Working hours deleted successfully' });
});
