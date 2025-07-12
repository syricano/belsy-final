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


// Reservation Schema
export const reservationSchema = z.object({
  tableId: z.number(),
  reservationTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid reservation time',
  }),
  note: z.string().max(500).optional(),
});

// Duty Hours Schema (for admin)
export const dutySchema = z.object({
  dayOfWeek: z.enum([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in HH:MM format',
  }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'End time must be in HH:MM format',
  }),
});

// Table Schema (for admin)
export const tableSchema = z.object({
  number: z.number().int().positive(),
  seats: z.number().int().positive(),
  location: z.enum(['inRestaurant', 'inHall']),
  isAvailable: z.boolean().optional(), // Optional: default handled by model
});
