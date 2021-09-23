/*
  Warnings:

  - You are about to drop the column `moduleId` on the `Module` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Module" DROP CONSTRAINT "Module_moduleId_fkey";

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "moduleId";
