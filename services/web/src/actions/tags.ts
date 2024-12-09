'use server';

import { auth } from '@/services/auth';
import { prisma } from '@/services/db';
import { Tag } from '@/types';

export async function listAvailableUserTags() {
  const session = await auth();

  if (!session) {
    throw new Error('User not authenticated');
  }

  return await prisma.tag.findMany({
    where: {
      images: {
        some: {
          ownerId: Number(session.user.id),
        },
      },
    },
    orderBy: {
      key: 'asc',
    },
  });
}

export async function listAllUserTags() {
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

export async function getTag(tagId: Tag['id']) {
  const session = await auth();

  if (!session) {
    throw new Error('User not authenticated');
  }

  return await prisma.tag.findFirst({
    where: {
      id: tagId,
      OR: [
        {
          ownerId: Number(session.user.id),
        },
        {
          ownerId: null,
        },
      ],
    },
  });
}
