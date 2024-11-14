import { PrismaClient } from '@prisma/client';

import { tags } from './classifier';

const prisma = new PrismaClient();

async function main() {
  await Promise.all(
    tags.map(async (tag) => {
      await prisma.tag.upsert({
        where: { key: tag },
        update: {},
        create: {
          key: tag,
        },
      });
    })
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
