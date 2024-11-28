'use server';

import { auth } from '@/services/auth';
import { prisma } from '@/services/db';

export async function listUserAlbums() {
  const session = await auth();

  if (!session) {
    throw new Error('User not authenticated');
  }

  return await prisma.album.findMany({
    where: {
      ownerId: Number(session.user.id),
    },
    orderBy: {
      title: 'asc',
    },
  });
}
