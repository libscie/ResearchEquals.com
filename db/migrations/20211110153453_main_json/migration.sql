/*
  Warnings:

  - Changed the type of `main` on the `Module` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Module" DROP COLUMN "main",
ADD COLUMN     "main" JSONB NOT NULL;
