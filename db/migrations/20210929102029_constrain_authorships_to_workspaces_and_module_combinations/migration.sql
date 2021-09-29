/*
  Warnings:

  - A unique constraint covering the columns `[moduleId,workspaceId]` on the table `Authorship` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Authorship.moduleId_invitedHandle_unique";

-- CreateIndex
CREATE UNIQUE INDEX "Authorship.moduleId_workspaceId_unique" ON "Authorship"("moduleId", "workspaceId");
