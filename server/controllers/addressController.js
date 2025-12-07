import Address from '../models/AddressInfo.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import { Op } from 'sequelize';


// GET /api/address — Public
export const getAddress = asyncHandler(async (req, res) => {
  const info = await Address.findOne();
  res.json(info || {});
});

// PUT /api/address — Admin only (update or create if none exists)
export const updateAddress = asyncHandler(async (req, res) => {
  let address = await Address.findOne();

  if (!address) {
    address = await Address.create(req.body);
    return res.status(201).json(address);
  }

  await address.update(req.body);
  res.json(address);
});

// DELETE /api/address/:id — Admin only
export const deleteAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const address = await Address.findByPk(id);

  if (!address) {
    throw new ErrorResponse('Address not found', 404);
  }

  await address.destroy();
  res.json({ message: 'Address deleted successfully' });
});
