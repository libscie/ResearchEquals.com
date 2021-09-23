/*
  Warnings:

  - You are about to drop the `_ModuleToWorkspace` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ModuleToWorkspace" DROP CONSTRAINT "_ModuleToWorkspace_A_fkey";

-- DropForeignKey
ALTER TABLE "_ModuleToWorkspace" DROP CONSTRAINT "_ModuleToWorkspace_B_fkey";

-- DropTable
DROP TABLE "_ModuleToWorkspace";

-- CreateTable
CREATE TABLE "_ModuleToAuthor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ModuleToAuthor_AB_unique" ON "_ModuleToAuthor"("A", "B");

-- CreateIndex
CREATE INDEX "_ModuleToAuthor_B_index" ON "_ModuleToAuthor"("B");

-- AddForeignKey
ALTER TABLE "_ModuleToAuthor" ADD FOREIGN KEY ("A") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModuleToAuthor" ADD FOREIGN KEY ("B") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
