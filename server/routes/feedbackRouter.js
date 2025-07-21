import express from 'express';
import {
  addFeedback,
  getFeedback,
  getMyFeedback,
  updateFeedback,
  deleteFeedback
} from '../controllers/feedbackController.js';

import optionalAuth from '../middleware/optionalAuth.js';
import verifyToken from '../middleware/verifyToken.js';
import isAdmin from '../middleware/isAdmin.js';
import validateZod from '../middleware/validateZod.js';
import { feedbackSchema } from '../zod/Schemas.js';
import { feedbackReplySchema } from '../zod/Schemas.js';

const feedbackRouter = express.Router();

// ========== USER & GUEST ROUTES ==========

// POST /api/feedback — Create feedback (user or guest)
feedbackRouter.post(
  '/',
  optionalAuth,
  validateZod(feedbackSchema),
  addFeedback
);

// GET /api/feedback/my — Get current user's feedback
feedbackRouter.get('/my', verifyToken, getMyFeedback);


// PUT — allow either full update or just reply
feedbackRouter.put(
  '/:id',
  verifyToken,
  (req, res, next) => {
    const isReply = Object.keys(req.body).includes('adminReply');
    const validate = validateZod(isReply ? feedbackReplySchema : feedbackSchema);
    return validate(req, res, next);
  },
  updateFeedback
);

// DELETE /api/feedback/:id — Delete feedback (user only)
feedbackRouter.delete('/:id', verifyToken, deleteFeedback);

// ========== ADMIN ROUTES ==========

// GET /api/feedback — Get all feedbacks (admin only)
feedbackRouter.get('/', getFeedback);

export default feedbackRouter;
