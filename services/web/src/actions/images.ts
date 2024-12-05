'use server';

import type { SaveImagesSchema, Image, ImageMetadata } from '@/types';
import type { ClassifyActionPayload } from '@/classifier/actions/classify.action';
import { auth } from '@/services/auth';
import {
  storage,
  saveFileToStorage,
  deleteFileFromStorage,
  type SaveFileToStorageResult,
  type SaveFileToStorageResultSuccess,
} from '@/services/storage';
import { prisma } from '@/services/db';
import { amqpClient } from '@/services/amqp';

export type ListUserImagesProps = {
  onlyPublic?: boolean;
  trashFilter?: 'ALL' | 'ONLY_TRASHED' | 'NOT_TRASHED';
};

export async function saveImages(
  formData: FormData
): Promise<SaveFileToStorageResult[]> {
  const session = await auth();

  if (!session) {
    throw new Error('User not authenticated');
  }

  const files = formData.getAll('files') as SaveImagesSchema['files'];
  const userUploadsFolder = `images/${session.user.id}`;

  const storageSaveResult = await Promise.all(
    files.map((file) => saveFileToStorage(storage, file, userUploadsFolder))
  );

  const savedImages = storageSaveResult.filter(
    (result) => result.saved
  ) as SaveFileToStorageResultSuccess[];

  if (savedImages.length === 0) {
    throw new Error('No images saved');
  }

  const imagesData = await prisma.image.createManyAndReturn({
    data: savedImages.map((image) => ({
      key: image.key,
      metadata: {
        name: image.name,
        size: image.size,
        type: image.type,
      },
      ownerId: Number(session.user.id),
    })),
    select: {
      id: true,
      key: true,
    },
  });

  await Promise.all(
    imagesData.map((image) =>
      amqpClient.publishToExchange<ClassifyActionPayload>(
        'pixelgrid',
        'pixelgrid.images',
        image
      )
    )
  );

  return storageSaveResult;
}

export async function listUserImages({
  onlyPublic = false,
  trashFilter = 'NOT_TRASHED',
}: ListUserImagesProps = {}): Promise<Image[]> {
  const session = await auth();

  if (!session) {
    throw new Error('User not authenticated');
  }

  const images = await prisma.image.findMany({
    where: {
      ownerId: Number(session.user.id),
      ...(onlyPublic && { accessGrantType: 'PUBLIC' }),
      ...(trashFilter === 'ONLY_TRASHED' && { movedToTrash: true }),
      ...(trashFilter === 'NOT_TRASHED' && { movedToTrash: false }),
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

export async function deleteImages(
  imageIds: Image['id'][],
  { onlyMoveToTrash = true } = {}
): Promise<void> {
  const session = await auth();

  if (!session) {
    throw new Error('User not authenticated');
  }

  if (onlyMoveToTrash) {
    await prisma.image.updateMany({
      where: {
        id: {
          in: imageIds,
        },
      },
      data: {
        movedToTrash: true,
      },
    });
  } else {
    const imagesToDelete = await prisma.image.findMany({
      where: {
        id: {
          in: imageIds,
        },
      },
      select: {
        id: true,
        key: true,
      },
    });

    await Promise.all(
      imagesToDelete.map((image) => deleteFileFromStorage(storage, image.key))
    );

    await prisma.image.deleteMany({
      where: {
        id: {
          in: imagesToDelete.map((image) => image.id),
        },
      },
    });
  }
}

export async function deleteAllUserImagesOnTrash(): Promise<void> {
  const session = await auth();

  if (!session) {
    throw new Error('User not authenticated');
  }

  const imagesToDelete = await prisma.image.findMany({
    where: {
      ownerId: Number(session.user.id),
      movedToTrash: true,
    },
    select: {
      id: true,
    },
  });

  await deleteImages(
    imagesToDelete.map((image) => image.id),
    { onlyMoveToTrash: false }
  );
}

export async function restoreImagesFromTrash(
  imageIds: Image['id'][]
): Promise<void> {
  const session = await auth();

  if (!session) {
    throw new Error('User not authenticated');
  }

  await prisma.image.updateMany({
    where: {
      id: {
        in: imageIds,
      },
    },
    data: {
      movedToTrash: false,
    },
  });
}
