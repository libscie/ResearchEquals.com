/*
  Warnings:

  - You are about to drop the column `supporting` on the `Module` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Module" DROP COLUMN "supporting",
ALTER COLUMN "main" DROP NOT NULL;
