import Feedback from '../models/Feedback.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import sendEmail from '../utils/sendEmail.js';
import { feedbackSubmittedEmail, feedbackUpdatedEmail, feedbackRepliedEmail, feedbackDeletedEmail  } from '../utils/emailTemplates.js';



// POST /api/feedback — Create feedback
export const addFeedback = asyncHandler(async (req, res) => {
  const { name, message, rating } = req.body;
  const userId = req.userId || null;

  const feedback = await Feedback.create({ name, message, rating, userId });
  if (req.user?.email) {
    await sendEmail({
      to: req.user.email,
      subject: 'Feedback Received – Belsy Restaurant',
      html: feedbackSubmittedEmail(req.user.firstName || 'Guest'),
    });
    await sendEmail({
    to: 'info.belsy@gmail.com',
    subject: 'New Feedback Submitted',
    html: `<p>New feedback by ${name} (${req.user?.email || 'Guest'})</p><p>Rating: ${rating}</p><p>Message: ${message}</p>`,
  });
  }
  res.status(201).json(feedback);
});

// GET /api/feedback — Get all feedback
export const getFeedback = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.findAll({
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

// PUT /api/feedback/:id — Update feedback
export const updateFeedback = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, message, rating } = req.body;

  const feedback = await Feedback.findByPk(id);
  if (!feedback) throw new ErrorResponse('Feedback not found', 404);

  if ('name' in req.body) feedback.name = req.body.name;
  if ('message' in req.body) feedback.message = req.body.message;
  if ('rating' in req.body) feedback.rating = req.body.rating;
  if ('adminReply' in req.body) feedback.adminReply = req.body.adminReply;

  await feedback.save();

  if (feedback.userId && req.user?.id === feedback.userId && req.user?.email) {
    await sendEmail({
      to: req.user.email,
      subject: 'Feedback Updated – Belsy Restaurant',
      html: feedbackUpdatedEmail(req.user.firstName || 'Guest'),
    });
  } else if (feedback.userId && 'adminReply' in req.body) {
    const user = await User.findByPk(feedback.userId);
    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: 'Reply to Your Feedback – Belsy Restaurant',
        html: feedbackRepliedEmail(user.firstName, req.body.adminReply),
      });
    }
  }
  res.status(200).json(feedback);
});

// DELETE /api/feedback/:id — Delete feedback
export const deleteFeedback = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const feedback = await Feedback.findByPk(id);
  if (!feedback) throw new ErrorResponse('Feedback not found', 404);

  await feedback.destroy();
  if (feedback.userId && req.user?.id === feedback.userId && req.user?.email) {
    await sendEmail({
      to: req.user.email,
      subject: 'Feedback Deleted – Belsy Restaurant',
      html: feedbackDeletedEmail(req.user.firstName || 'Guest'),
    });
  }

  res.status(200).json({ message: 'Feedback deleted successfully' });
});
