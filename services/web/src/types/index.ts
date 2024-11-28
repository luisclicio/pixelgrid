import { z } from 'zod';
import {
  Image as PrismaImage,
  Tag as PrismaTag,
  Album as PrismaAlbum,
} from '@prisma/client';

import {
  loginSchema,
  registerSchema,
  saveImagesSchema,
} from '@/libs/validation';

export type LoginSchema = z.infer<typeof loginSchema>;

export type RegisterSchema = z.infer<typeof registerSchema>;

export type SaveImagesSchema = z.infer<typeof saveImagesSchema>;

export type Tag = PrismaTag;

export type ImageMetadata = {
  name?: string | null;
  size?: number | null;
  type?: string | null;
};

export type Image = PrismaImage & {
  metadata: ImageMetadata;
  tags: Tag[];
  favorite: boolean;
  url?: string;
};

export type Album = PrismaAlbum;
