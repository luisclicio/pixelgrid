'use server';

import type { Image, ImageMetadata } from '@/types';
import { auth } from '@/services/auth';
import { storage } from '@/services/storage';
import { prisma } from '@/services/db';

export async function listFavoritesUserImages(): Promise<Image[]> {
  const session = await auth();

  if (!session) {
    throw new Error('User not authenticated');
  }

  const images = await prisma.image.findMany({
    where: {
      favorites: {
        some: {
          userId: Number(session.user.id),
        },
      },
      OR: [
        {
          accessGrantType: 'PUBLIC',
        },
        {
          ownerId: Number(session.user.id),
        },
      ],
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
