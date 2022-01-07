/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ModuleType` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ModuleType" ALTER COLUMN "wikidata" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ModuleType_name_key" ON "ModuleType"("name");
