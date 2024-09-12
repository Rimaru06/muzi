-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "bigImageUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "smallImageUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT '';
