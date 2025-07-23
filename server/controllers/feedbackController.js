import Feedback from '../models/Feedback.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import sendEmail from '../utils/sendEmail.js';
import {
  feedbackSubmittedEmail,
  feedbackUpdatedEmail,
  feedbackDeletedEmail,
  feedbackRepliedEmail
} from '../utils/emailTemplates.js';

// POST /api/feedback — Create feedback
export const addFeedback = asyncHandler(async (req, res) => {
  const { name, message, rating, email, phone } = req.body;

  // Prevent Admin from posting feedback
  if (req.user?.role === 'Admin') {
    throw new ErrorResponse('Admins are not allowed to post feedback', 403);
  }

  const userId = req.user?.id || req.userId || null;
  const feedback = await Feedback.create({
    name: req.user?.firstName || name || 'Guest',
    message,
    rating: Number(rating),
    userId,
  });

  const recipientEmail = req.user?.email || email;

  if (recipientEmail) {
    try {
      await sendEmail({
        to: recipientEmail,
        subject: 'Feedback Received – Belsy Restaurant',
        html: feedbackSubmittedEmail(req.user?.firstName || name || 'Guest'),
      });
    } catch (err) {
      console.error('❌ Failed to send feedback confirmation email:', err.message);
    }
  }

  res.status(201).json(feedback);
});

// GET /api/feedback — Get all feedback
export const getFeedback = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.findAll({
    include: [{ model: User, attributes: ['firstName', 'email'] }],
    order: [['createdAt', 'DESC']],
  });
  res.status(200).json(feedbacks);
});

// GET /api/feedback/my — Get feedback by current user
export const getMyFeedback = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const feedbacks = await Feedback.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
  });
  res.status(200).json(feedbacks);
});

// PUT /api/feedback/:id — Update or reply
export const updateFeedback = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, message, rating, adminReply } = req.body;

  const feedback = await Feedback.findByPk(id, { include: [User] });
  if (!feedback) throw new ErrorResponse('Feedback not found', 404);

  const isAdmin = req.user?.role === 'Admin';
  const isOwner = feedback.userId && feedback.userId === req.user?.id;

  if (!isAdmin && !isOwner) {
    throw new ErrorResponse('You are not authorized to update this feedback', 403);
  }

  if (!isAdmin) {
    if ('name' in req.body) feedback.name = name;
    if ('message' in req.body) feedback.message = message;
    if ('rating' in req.body) {
      const numericRating = Number(rating);
      if (isNaN(numericRating)) {
        throw new ErrorResponse('Rating must be a number', 400);
      }
      feedback.rating = numericRating;
    }
  }

  if (isAdmin && 'adminReply' in req.body) {
    feedback.adminReply = adminReply;
  }

  await feedback.save();

  const recipient = feedback.User || {};
  const recipientEmail = recipient.email || null;
  const recipientName = recipient.firstName || feedback.name || 'Guest';

  if (recipientEmail) {
    try {
      const emailContent =
        isAdmin && adminReply
          ? feedbackRepliedEmail(recipientName, adminReply)
          : feedbackUpdatedEmail(recipientName);

      const subject =
        isAdmin && adminReply
          ? 'Reply to Your Feedback – Belsy Restaurant'
          : 'Feedback Updated – Belsy Restaurant';

      await sendEmail({
        to: recipientEmail,
        subject,
        html: emailContent,
      });
    } catch (err) {
      console.error('❌ Failed to send update/reply email:', err.message);
    }
  }

  res.status(200).json(feedback);
});

// DELETE /api/feedback/:id — Delete feedback
export const deleteFeedback = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const feedback = await Feedback.findByPk(id, { include: [User] });
  if (!feedback) throw new ErrorResponse('Feedback not found', 404);

  const isAdmin = req.user?.role === 'Admin';
  const isOwner = feedback.userId && feedback.userId === req.user?.id;

  if (!isAdmin && !isOwner) {
    throw new ErrorResponse('You are not authorized to delete this feedback', 403);
  }

  await feedback.destroy();

  const recipientEmail = feedback.User?.email;
  const recipientName = feedback.User?.firstName || feedback.name || 'Guest';

  if (recipientEmail) {
    try {
      await sendEmail({
        to: recipientEmail,
        subject: 'Feedback Deleted – Belsy Restaurant',
        html: feedbackDeletedEmail(recipientName),
      });
    } catch (err) {
      console.error('❌ Failed to send feedback deletion email:', err.message);
    }
  }

  res.status(200).json({ message: 'Feedback deleted successfully' });
});
