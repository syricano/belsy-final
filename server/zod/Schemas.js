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