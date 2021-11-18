/*
  Warnings:

  - You are about to drop the column `type` on the `Module` table. All the data in the column will be lost.
  - Added the required column `moduleTypeId` to the `Module` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Module" DROP COLUMN "type",
ADD COLUMN     "moduleTypeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Module" ADD FOREIGN KEY ("moduleTypeId") REFERENCES "ModuleType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
