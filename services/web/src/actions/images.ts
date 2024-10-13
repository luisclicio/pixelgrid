'use server';

import fs from 'node:fs/promises';

import type { SaveImagesSchema } from '@/types';
import { auth } from '@/services/auth';

export async function saveImages(formData: FormData) {
  const session = await auth();

  if (!session) {
    throw new Error('User not authenticated');
  }

  const files = formData.getAll('files') as SaveImagesSchema['files'];

  const userUploadsFolder = `./uploads/${session?.user.id}`;

  await fs.mkdir(userUploadsFolder, { recursive: true });

  await Promise.all(
    files.map(async (file) => {
      const filePath = `${userUploadsFolder}/${Date.now()}___${file.name}`;
      const buffer = await file.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(buffer));

      console.log(`File ${file.name} saved`);
    })
  );
}
