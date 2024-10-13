import { z } from 'zod';

import {
  loginSchema,
  registerSchema,
  saveImagesSchema,
} from '@/libs/validation';

export type LoginSchema = z.infer<typeof loginSchema>;

export type RegisterSchema = z.infer<typeof registerSchema>;

export type SaveImagesSchema = z.infer<typeof saveImagesSchema>;
