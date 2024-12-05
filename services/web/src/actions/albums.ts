'use server';

import { auth } from '@/services/auth';
import { prisma } from '@/services/db';

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
