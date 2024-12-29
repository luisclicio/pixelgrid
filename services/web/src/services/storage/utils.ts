import { type Disk } from 'flydrive';

import { Cache } from '@/libs/cache';

export type SaveFileToStorageResultSuccess = {
  saved: boolean;
  name: string;
  key: string;
  size: number;
  type: string;
};

export type SaveFileToStorageResultError = {
  saved: boolean;
  name: string;
};

export type SaveFileToStorageResult =
  | SaveFileToStorageResultSuccess
  | SaveFileToStorageResultError;

export function createFileKey(
  originalName: string,
  prefix: string = ''
): string {
  const fileNameParsed = originalName
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_.]/g, '');
  const timestamp = Date.now();
  const fileName = [timestamp.toString(), fileNameParsed]
    .filter(Boolean)
    .join('___');
  const fileKey = [prefix.trim(), fileName].filter(Boolean).join('/');
  return fileKey;
}

export async function saveFileToStorage(
  storage: Disk,
  file: File,
  prefix: string = ''
): Promise<SaveFileToStorageResult> {
  try {
    const fileKey = createFileKey(file.name, prefix);
    const buffer = await file.arrayBuffer();

    await storage.put(fileKey, new Uint8Array(buffer));

    return {
      saved: true,
      key: fileKey,
      name: file.name,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    console.error(error);

    return {
      saved: false,
      name: file.name,
    };
  }
}

export async function deleteFileFromStorage(
  storage: Disk,
  key: string
): Promise<void> {
  return await storage.delete(key);
}

export async function getSignedUrlFromStorage(
  storage: Disk,
  key: string,
  {
    expiresIn = 60 * 60, // 60 minutes
    useCache = false,
    cache,
  }: {
    expiresIn?: number;
    useCache?: boolean;
    cache?: Cache;
  } = {}
): Promise<string> {
  if (useCache && cache) {
    const cachedUrl = cache.get<string>(key);

    if (cachedUrl) {
      return cachedUrl;
    }
  }

  const signedUrl = await storage.getSignedUrl(key, {
    expiresIn,
  });

  if (useCache && cache) {
    cache.put(key, signedUrl, { expiresIn: expiresIn * 1000 });
  }

  return signedUrl;
}
