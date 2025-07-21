import { z } from 'zod';

export const userSchema = {
  POST: z.object({
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
    phone: z.string().optional(), // optional field
    email: z.string().email(),
    password: z.string().min(6).max(100),
  }),
  PUT: z.object({
    firstName: z.string().min(2).max(100).trim(),
    lastName: z.string().min(2).max(100).optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).max(100).optional(),
  }),
};

export const signInSchema = z.object({
  email: z.string().min(2),  // email
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
export const reservationSchema = z
  .object({
    tableIds: z
      .array(z.number().int().positive())
      .nonempty({ message: 'At least one table must be selected' }),
    reservationTime: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid reservation time',
      }),
    guests: z.number().int().positive().optional(),
    note: z.string().max(500).optional(),

    // Guest info
    name: z.string().max(100).optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().max(20).optional().or(z.literal('')),
  })
  .refine((data) => {
    // If name is missing, phone must be provided
    if (!data.name && !data.phone) {
      return false;
    }
    return true;
  }, {
    message: 'Phone is required when name is not provided',
    path: ['phone'],
  });

  // admin response schema
export const adminResponseSchema = z.object({
  adminResponse: z.string().min(2, 'Response is required, Please write a friendly response to customer')
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


// Suggest Table Schema for Booking reservations logic
export const suggestTablesSchema = z.object({
  guests: z.number().int().positive(),
  reservationTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid reservation time',
    }),
});


// Menu Schema
export const menuSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  price: z.coerce.number(), 
  image: z.string().url().optional().or(z.literal('')), // can be empty string
  categoryId: z.coerce.number(),
});


// Contact Info Schema
export const contactInfoSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(5).max(20),
  address: z.string().min(5).max(200),
});


// Category Schema
export const categorySchema = z.object({
  name: z.string().min(2).max(100),
});



// Feedback Schema
export const feedbackSchema = z.object({
  name: z.string().min(2, 'Name is required').optional().or(z.literal('')),
  message: z.string().min(5, 'Message must be at least 5 characters'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5').optional(),
});


// Feedback Update Schema
export const feedbackReplySchema = z.object({
  adminReply: z.string().min(1, 'Reply cannot be empty'),
});
