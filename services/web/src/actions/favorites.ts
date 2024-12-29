'use server';

import type { Image, ImageMetadata, ServerActionResult, Tag } from '@/types';
import { auth } from '@/services/auth';
import { getSignedUrlFromStorage, storage } from '@/services/storage';
import { prisma } from '@/services/db';
import { cache } from '@/services/cache';

export type ListFavoritesUserImagesProps = {
  tagsKeys?: Tag['key'][];
};

export async function listFavoritesUserImages({
  tagsKeys = [],
}: ListFavoritesUserImagesProps = {}): Promise<Image[]> {
  const session = await auth();

  if (!session) {
    throw new Error('User not authenticated');
  }

  const images = await prisma.image.findMany({
    where: {
      movedToTrash: false,
      favorites: {
        some: {
          userId: Number(session.user.id),
        },
      },
      tags: {
        some: {
          ...(tagsKeys?.length > 0 && {
            key: {
              in: tagsKeys,
            },
          }),
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
      url: await getSignedUrlFromStorage(storage, image.key, {
        useCache: true,
        cache,
      }),
      favorite: favorites.length > 0,
    }))
  );
}

export async function toggleFavoriteImage(
  imageId: Image['id']
): Promise<ServerActionResult> {
  try {
    const session = await auth();

    if (!session) {
      throw new Error('User not authenticated');
    }

    const isFavorite = await prisma.favorite.findFirst({
      where: {
        userId: Number(session.user.id),
        imageId: imageId,
      },
    });

    if (isFavorite) {
      await prisma.favorite.delete({
        where: {
          userId_imageId: {
            userId: Number(session.user.id),
            imageId: imageId,
          },
        },
      });
    } else {
      await prisma.favorite.create({
        data: {
          userId: Number(session.user.id),
          imageId: imageId,
        },
      });
    }

    return {
      status: 'SUCCESS',
    };
  } catch (error) {
    console.error(error);

    return {
      status: 'ERROR',
    };
  }
}
