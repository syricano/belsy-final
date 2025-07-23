import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import sendEmail from '../utils/sendEmail.js';
import ErrorResponse from '../utils/errorResponse.js';

const contactRouter = express.Router();

// POST /api/contact/message
contactRouter.post('/message', asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    throw new ErrorResponse('All fields are required', 400);
  }

  await sendEmail({
    to: 'info.belsy@gmail.com',
    subject: `New Contact Form Message from ${name}`,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `
  });

  res.status(200).json({ message: 'Message sent successfully' });
}));

export default contactRouter;
