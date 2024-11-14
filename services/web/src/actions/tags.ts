'use server';

import { auth } from '@/services/auth';
import { prisma } from '@/services/db';

export async function listUserTags() {
  const session = await auth();

  if (!session) {
    throw new Error('User not authenticated');
  }

  return await prisma.tag.findMany({
    where: {
      OR: [
        {
          ownerId: Number(session.user.id),
        },
        {
          ownerId: null,
        },
      ],
    },
    orderBy: {
      key: 'asc',
    },
  });
}
