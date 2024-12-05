/*
  Warnings:

  - You are about to drop the `_albuns_images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_albuns_images" DROP CONSTRAINT "_albuns_images_A_fkey";

-- DropForeignKey
ALTER TABLE "_albuns_images" DROP CONSTRAINT "_albuns_images_B_fkey";

-- DropTable
DROP TABLE "_albuns_images";

-- CreateTable
CREATE TABLE "_albums_images" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_albums_images_AB_unique" ON "_albums_images"("A", "B");

-- CreateIndex
CREATE INDEX "_albums_images_B_index" ON "_albums_images"("B");

-- AddForeignKey
ALTER TABLE "_albums_images" ADD CONSTRAINT "_albums_images_A_fkey" FOREIGN KEY ("A") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_albums_images" ADD CONSTRAINT "_albums_images_B_fkey" FOREIGN KEY ("B") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;
