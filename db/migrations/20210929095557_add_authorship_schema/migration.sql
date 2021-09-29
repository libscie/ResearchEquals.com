/*
  Warnings:

  - You are about to drop the `_ModuleToAuthor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ModuleToAuthor" DROP CONSTRAINT "_ModuleToAuthor_A_fkey";

-- DropForeignKey
ALTER TABLE "_ModuleToAuthor" DROP CONSTRAINT "_ModuleToAuthor_B_fkey";

-- DropTable
DROP TABLE "_ModuleToAuthor";

-- CreateTable
CREATE TABLE "Authorship" (
    "id" SERIAL NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "workspaceId" INTEGER,
    "invitedHandle" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Authorship.moduleId_invitedHandle_unique" ON "Authorship"("moduleId", "invitedHandle");

-- AddForeignKey
ALTER TABLE "Authorship" ADD FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authorship" ADD FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
