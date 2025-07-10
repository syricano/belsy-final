import { z } from 'zod';

export const userSchema = {
  POST: z.object({
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
    username: z.string().min(2).max(100),
    phone: z.string().optional(), // optional field
    email: z.string().email(),
    password: z.string().min(6).max(100),
  }),
  PUT: z.object({
    firstName: z.string().min(2).max(100).trim(),
    lastName: z.string().min(2).max(100).optional(),
    username: z.string().min(2).max(100).optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).max(100).optional(),
  }),
};

export const signInSchema = z.object({
  identifier: z.string().min(2),  // username or email
  password: z.string().min(6).max(100),
});
export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});
export const resetPasswordSchema = z.object({
  password: z.string().min(6).max(100),
  confirmPassword: z.string().min(6).max(100),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
export const updateProfileSchema = z.object({
  firstName: z.string().min(2).max(100).optional(),
  lastName: z.string().min(2).max(100).optional(),
  username: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6).max(100),
  newPassword: z.string().min(6).max(100),
  confirmNewPassword: z.string().min(6).max(100),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ['confirmNewPassword'],
});
export const deleteAccountSchema = z.object({
  password: z.string().min(6).max(100),
});
export const userRoleSchema = z.object({
  role: z.enum(['User', 'Admin']),
});
