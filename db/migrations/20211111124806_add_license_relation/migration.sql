/*
  Warnings:

  - You are about to drop the column `license` on the `Module` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Module" DROP COLUMN "license",
ADD COLUMN     "licenseId" INTEGER;

-- CreateTable
CREATE TABLE "License" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Module" ADD FOREIGN KEY ("licenseId") REFERENCES "License"("id") ON DELETE SET NULL ON UPDATE CASCADE;
