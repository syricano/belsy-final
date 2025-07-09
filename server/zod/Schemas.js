import { z } from 'zod/v4';

export const userSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  username: z.string().min(3).max(20),
  phone: z.string().optional(),
  email: z.string(),
  password: z.string().min(8).max(12)
});

export const signInSchema = userSchema.omit({ firstName: true, lastName: true , phone: true });

