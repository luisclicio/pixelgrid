import { DriveManager } from 'flydrive';
import { S3Driver } from 'flydrive/drivers/s3';
import {
  BucketAlreadyExists,
  BucketAlreadyOwnedByYou,
  CreateBucketCommand,
  S3Client,
} from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.STORAGE_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.STORAGE_S3_SECRET_ACCESS_KEY!,
  },
  region: process.env.STORAGE_S3_REGION,
  endpoint: process.env.STORAGE_S3_ENDPOINT,
  forcePathStyle: process.env.STORAGE_S3_FORCE_PATH_STYLE === 'true',
});

export const drive = new DriveManager({
  default: 's3',

  services: {
    s3: () =>
      new S3Driver({
        client: s3Client,
        bucket: process.env.STORAGE_S3_BUCKET!,
        visibility: 'private',
      }),
  },
});

export const storage = drive.use();

async function setupStorage() {
  try {
    await s3Client.send(
      new CreateBucketCommand({
        Bucket: process.env.STORAGE_S3_BUCKET!,
      })
    );
  } catch (error) {
    if (
      error instanceof BucketAlreadyExists ||
      error instanceof BucketAlreadyOwnedByYou
    ) {
      return;
    }

    console.error(error);
  }
}

setupStorage();
