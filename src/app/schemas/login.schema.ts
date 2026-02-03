import { z } from 'zod';
import { UserRole } from '../types';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  role: z.nativeEnum(UserRole).optional(),
  rememberMe: z.boolean().optional().default(true),
});

export type LoginFormData = z.infer<typeof loginSchema>;
