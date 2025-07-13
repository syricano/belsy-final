import ContactInfo from '../models/ContactInfo.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// GET /api/contact — Public
export const getContactInfo = asyncHandler(async (req, res) => {
  const info = await ContactInfo.findOne();
  res.json(info || {});
});

// PUT /api/contact — Admin only (update or create if none exists)
export const updateContactInfo = asyncHandler(async (req, res) => {
  let contact = await ContactInfo.findOne();

  if (!contact) {
    contact = await ContactInfo.create(req.body);
    return res.status(201).json(contact);
  }

  await contact.update(req.body);
  res.json(contact);
});
