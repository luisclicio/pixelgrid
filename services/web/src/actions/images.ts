'use server';

import type { SaveImagesSchema, Image, ImageMetadata } from '@/types';
import { auth } from '@/services/auth';
import {
  storage,
  saveFileToStorage,
  type SaveFileToStorageResult,
  type SaveFileToStorageResultSuccess,
} from '@/services/storage';
import { prisma } from '@/services/db';

export async function saveImages(
  formData: FormData
): Promise<SaveFileToStorageResult[]> {
  const session = await auth();

  if (!session) {
    throw new Error('User not authenticated');
  }

  const files = formData.getAll('files') as SaveImagesSchema['files'];
  const userUploadsFolder = `images/${session.user.id}`;

  const storageSaveResult = await Promise.all(
    files.map((file) => saveFileToStorage(storage, file, userUploadsFolder))
  );

  const savedImages = storageSaveResult.filter(
    (result) => result.saved
  ) as SaveFileToStorageResultSuccess[];

  if (savedImages.length === 0) {
    throw new Error('No images saved');
  }

  await prisma.image.createMany({
    data: savedImages.map((image) => ({
      key: image.key,
      metadata: {
        name: image.name,
        size: image.size,
        type: image.type,
      },
      ownerId: Number(session.user.id),
    })),
  });

  // TODO: sends images id and key to the broker

  return storageSaveResult;
}

export async function listUserImages(): Promise<Image[]> {
  const session = await auth();

  if (!session) {
    throw new Error('User not authenticated');
  }

  const images = await prisma.image.findMany({
    where: {
      ownerId: Number(session.user.id),
    },
    include: {
      tags: true,
      favorites: {
        where: {
          userId: Number(session.user.id),
        },
        select: {
          userId: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return Promise.all(
    images.map(async ({ favorites, ...image }) => ({
      ...image,
      metadata: image.metadata as ImageMetadata,
      url: await storage.getSignedUrl(image.key, { expiresIn: '30m' }),
      favorite: favorites.length > 0,
    }))
  );
}
