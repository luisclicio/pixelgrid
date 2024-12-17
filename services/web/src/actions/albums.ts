'use server';

import type { Album, SaveAlbumSchema, ServerActionResult } from '@/types';
import { auth } from '@/services/auth';
import { prisma } from '@/services/db';
import { deleteImages } from './images';

export type ListUserAlbumsProps = {
  onlyPublic?: boolean;
  trashFilter?: 'ALL' | 'ONLY_TRASHED' | 'NOT_TRASHED';
  searchQuery?: string;
};

export async function saveAlbum({
  title,
}: SaveAlbumSchema): Promise<ServerActionResult<Album>> {
  try {
    const session = await auth();

    if (!session) {
      throw new Error('User not authenticated');
    }

    return {
      status: 'SUCCESS',
      data: await prisma.album.create({
        data: {
          title,
          ownerId: Number(session.user.id),
        },
      }),
    };
  } catch (error) {
    console.error(error);

    return {
      status: 'ERROR',
    };
  }
}

export async function updateAlbum(
  albumId: Album['id'],
  data: Partial<Album>
): Promise<ServerActionResult<Album>> {
  try {
    const session = await auth();

    if (!session) {
      throw new Error('User not authenticated');
    }

    return {
      status: 'SUCCESS',
      data: await prisma.album.update({
        where: {
          id: albumId,
          ownerId: Number(session.user.id),
        },
        data,
      }),
    };
  } catch (error) {
    console.error(error);

    return {
      status: 'ERROR',
    };
  }
}

export async function listUserAlbums({
  onlyPublic = false,
  trashFilter = 'NOT_TRASHED',
  searchQuery,
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
      ...(searchQuery && {
        title: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      }),
    },
    orderBy: {
      title: 'asc',
    },
  });
}

export async function getAlbum(albumId: Album['id']) {
  const session = await auth();

  if (!session) {
    throw new Error('User not authenticated');
  }

  return await prisma.album.findFirst({
    where: {
      id: albumId,
      ownerId: Number(session.user.id),
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
