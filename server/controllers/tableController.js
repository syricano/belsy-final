import Table from '../models/Table.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import { Op } from 'sequelize';


// GET /api/tables — user-accessible
export const getAllTables = asyncHandler(async (req, res) => {
  const tables = await Table.findAll();
  res.json(tables);
});

// POST /api/tables — admin only
export const createTable = asyncHandler(async (req, res) => {
  const { number, seats, isAvailable, location } = req.body;
  const newTable = await Table.create({ number, seats, isAvailable, location });
  res.status(201).json(newTable);
});

// PUT /api/tables/:id — admin only
export const updateTable = asyncHandler(async (req, res) => {
  const table = await Table.findByPk(req.params.id);
  if (!table) {
    throw new ErrorResponse('Table not found', 404);
  }

  await table.update(req.body);
  res.json(table);
});

// DELETE /api/tables/:id — admin only
export const deleteTable = asyncHandler(async (req, res) => {
  const table = await Table.findByPk(req.params.id);
  if (!table) {
    throw new ErrorResponse('Table not found', 404);
  }

  await table.destroy();
  res.json({ message: 'Table deleted successfully' });
});
