'use server';

import { auth } from '@/services/auth';
import { prisma } from '@/services/db';
import { Tag } from '@/types';

export type ListAvailableUserTagsProps = {
  searchQuery?: string;
};

export type ListAllUserTagsProps = {
  searchQuery?: string;
};

export async function listAvailableUserTags({
  searchQuery,
}: ListAvailableUserTagsProps = {}) {
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
      ...(searchQuery && {
        OR: [
          {
            key: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            label: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        ],
      }),
    },
    orderBy: {
      key: 'asc',
    },
  });
}

export async function listAllUserTags({
  searchQuery,
}: ListAllUserTagsProps = {}) {
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
      ...(searchQuery && {
        OR: [
          {
            key: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            label: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        ],
      }),
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
