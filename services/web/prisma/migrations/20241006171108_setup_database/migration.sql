-- CreateEnum
CREATE TYPE "ResourceAccessGrantType" AS ENUM ('PRIVATE', 'PUBLIC');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "access_grant_type" "ResourceAccessGrantType" NOT NULL DEFAULT 'PRIVATE',
    "description" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "owner_id" INTEGER NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "albums" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "access_grant_type" "ResourceAccessGrantType" NOT NULL DEFAULT 'PRIVATE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "owner_id" INTEGER NOT NULL,

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "owner_id" INTEGER,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "user_id" INTEGER NOT NULL,
    "image_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("user_id","image_id")
);

-- CreateTable
CREATE TABLE "_images_tags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_albuns_images" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "images_key_key" ON "images"("key");

-- CreateIndex
CREATE UNIQUE INDEX "tags_key_key" ON "tags"("key");

-- CreateIndex
CREATE UNIQUE INDEX "_images_tags_AB_unique" ON "_images_tags"("A", "B");

-- CreateIndex
CREATE INDEX "_images_tags_B_index" ON "_images_tags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_albuns_images_AB_unique" ON "_albuns_images"("A", "B");

-- CreateIndex
CREATE INDEX "_albuns_images_B_index" ON "_albuns_images"("B");

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_images_tags" ADD CONSTRAINT "_images_tags_A_fkey" FOREIGN KEY ("A") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_images_tags" ADD CONSTRAINT "_images_tags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_albuns_images" ADD CONSTRAINT "_albuns_images_A_fkey" FOREIGN KEY ("A") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_albuns_images" ADD CONSTRAINT "_albuns_images_B_fkey" FOREIGN KEY ("B") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;
