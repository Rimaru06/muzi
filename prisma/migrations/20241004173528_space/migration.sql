/*
  Warnings:

  - Added the required column `spaceid` to the `Stream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spaceId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "spaceid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "spaceId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Space" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,

    CONSTRAINT "Space_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stream" ADD CONSTRAINT "Stream_spaceid_fkey" FOREIGN KEY ("spaceid") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
