import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import validateZod from '../middleware/validateZod.js';
import verifyToken from '../middleware/verifyToken.js';

import {
  me,
  signup,
  signin,
  signout,
  forgotPassword,
  resetPassword,
  updateProfile,
  deleteAccount
} from '../controllers/auth.js';

import {
  userSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema
} from '../zod/Schemas.js';

import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

const authRouter = express.Router();

// 🧠 Base Auth Routes
authRouter.get("/me", verifyToken, me);
authRouter.post("/signup", validateZod(userSchema.POST), signup);
authRouter.post("/signin", validateZod(signInSchema), signin);
authRouter.post("/signout", signout);
authRouter.put("/update-profile", verifyToken, validateZod(updateProfileSchema), updateProfile);
authRouter.post("/delete-account", verifyToken, validateZod(deleteAccountSchema), deleteAccount);
authRouter.post("/forgot-password", validateZod(forgotPasswordSchema), forgotPassword);
authRouter.post("/reset-password/:token", validateZod(resetPasswordSchema), resetPassword);

// 🔐 Change Password
authRouter.put(
  "/change-password",
  verifyToken,
  validateZod(changePasswordSchema),
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'password'],
    });

    if (!user) throw new ErrorResponse('User not found', 404);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new ErrorResponse('Current password is incorrect', 401);

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  })
);

// 🟢 Google OAuth Login

authRouter.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

authRouter.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/signin',
    session: true,
  }),
  (req, res) => {
    if (!req.user) {
      console.log('❌ req.user is missing');
      return res.redirect('/signin');
    }

    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log('✅ Google user authenticated:', req.user.email);
    console.log('✅ Redirecting to frontend:', `${process.env.CLIENT_URL}/profile`);

    res.redirect(`${process.env.CLIENT_URL}/profile`);
  }
);

export default authRouter;