-- AlterTable
ALTER TABLE "albums" ADD COLUMN     "moved_to_trash" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "images" ADD COLUMN     "moved_to_trash" BOOLEAN NOT NULL DEFAULT false;
