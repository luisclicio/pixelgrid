'use server';

import type { Album } from '@/types';
import { auth } from '@/services/auth';
import { prisma } from '@/services/db';
import { deleteImages } from './images';

export type ListUserAlbumsProps = {
  onlyPublic?: boolean;
  trashFilter?: 'ALL' | 'ONLY_TRASHED' | 'NOT_TRASHED';
};

export async function listUserAlbums({
  onlyPublic = false,
  trashFilter = 'NOT_TRASHED',
}: ListUserAlbumsProps = {}) {
  const session = await auth();

  if (!session) {
    throw new Error('User not authenticated');
  }

  return await prisma.album.findMany({
    where: {
      ownerId: Number(session.user.id),
      ...(onlyPublic && { accessGrantType: 'PUBLIC' }),
      ...(trashFilter === 'ONLY_TRASHED' && { movedToTrash: true }),
      ...(trashFilter === 'NOT_TRASHED' && { movedToTrash: false }),
    },
    orderBy: {
      title: 'asc',
    },
  });
}

export async function deleteAlbums(
  albumsIds: Album['id'][],
  { onlyMoveToTrash = true } = {}
): Promise<void> {
  const session = await auth();

  if (!session) {
    throw new Error('User not authenticated');
  }

  if (onlyMoveToTrash) {
    await prisma.album.updateMany({
      where: {
        id: {
          in: albumsIds,
        },
      },
      data: {
        movedToTrash: true,
      },
    });
  } else {
    const imagesToDelete = await prisma.image.findMany({
      where: {
        albums: {
          some: {
            id: {
              in: albumsIds,
            },
          },
          every: {
            id: {
              in: albumsIds,
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    await deleteImages(
      imagesToDelete.map((image) => image.id),
      { onlyMoveToTrash: false }
    );

    await prisma.album.deleteMany({
      where: {
        id: {
          in: albumsIds,
        },
      },
    });
  }
}

export async function deleteAllUserAlbumsOnTrash(): Promise<void> {
  const session = await auth();

  if (!session) {
    throw new Error('User not authenticated');
  }

  const albumsToDelete = await prisma.album.findMany({
    where: {
      ownerId: Number(session.user.id),
      movedToTrash: true,
    },
    select: {
      id: true,
    },
  });

  await deleteAlbums(
    albumsToDelete.map((album) => album.id),
    { onlyMoveToTrash: false }
  );
}

export async function restoreAlbumsFromTrash(
  albumIds: Album['id'][]
): Promise<void> {
  const session = await auth();

  if (!session) {
    throw new Error('User not authenticated');
  }

  await prisma.album.updateMany({
    where: {
      id: {
        in: albumIds,
      },
    },
    data: {
      movedToTrash: false,
    },
  });
}
