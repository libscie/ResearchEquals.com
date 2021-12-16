/*
  Warnings:

  - A unique constraint covering the columns `[prefix,suffix]` on the table `Module` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Module_suffix_key";

-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "authorsRaw" JSONB,
ADD COLUMN     "isbn" TEXT,
ADD COLUMN     "prefix" TEXT,
ADD COLUMN     "publishedWhere" TEXT,
ADD COLUMN     "referencesRaw" JSONB,
ADD COLUMN     "url" TEXT,
ALTER COLUMN "suffix" DROP NOT NULL,
ALTER COLUMN "title" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "_ModuleReference" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ModuleReference_AB_unique" ON "_ModuleReference"("A", "B");

-- CreateIndex
CREATE INDEX "_ModuleReference_B_index" ON "_ModuleReference"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Module_prefix_suffix_key" ON "Module"("prefix", "suffix");

-- AddForeignKey
ALTER TABLE "_ModuleReference" ADD FOREIGN KEY ("A") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModuleReference" ADD FOREIGN KEY ("B") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
