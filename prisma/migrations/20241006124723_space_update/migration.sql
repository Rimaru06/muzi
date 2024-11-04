/*
  Warnings:

  - You are about to drop the column `userid` on the `Space` table. All the data in the column will be lost.
  - You are about to drop the column `spaceid` on the `Stream` table. All the data in the column will be lost.
  - You are about to drop the column `spaceId` on the `User` table. All the data in the column will be lost.
  - Added the required column `name` to the `Space` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spaceId` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Stream" DROP CONSTRAINT "Stream_spaceid_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_spaceId_fkey";

-- AlterTable
ALTER TABLE "Space" DROP COLUMN "userid",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Stream" DROP COLUMN "spaceid",
ADD COLUMN     "spaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "spaceId";

-- CreateTable
CREATE TABLE "_UserSpaces" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserSpaces_AB_unique" ON "_UserSpaces"("A", "B");

-- CreateIndex
CREATE INDEX "_UserSpaces_B_index" ON "_UserSpaces"("B");

-- AddForeignKey
ALTER TABLE "Stream" ADD CONSTRAINT "Stream_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSpaces" ADD CONSTRAINT "_UserSpaces_A_fkey" FOREIGN KEY ("A") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSpaces" ADD CONSTRAINT "_UserSpaces_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
