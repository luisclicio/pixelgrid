'use server';

import { auth } from '@/services/auth';
import { prisma } from '@/services/db';

export type ListUserAlbumsProps = {
  onlyPublic?: boolean;
};

export async function listUserAlbums({
  onlyPublic = false,
}: ListUserAlbumsProps = {}) {
  const session = await auth();

  if (!session) {
    throw new Error('User not authenticated');
  }

  return await prisma.album.findMany({
    where: {
      ownerId: Number(session.user.id),
      ...(onlyPublic && { accessGrantType: 'PUBLIC' }),
    },
    orderBy: {
      title: 'asc',
    },
  });
}
