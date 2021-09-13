/*
  Warnings:

  - A unique constraint covering the columns `[handle]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Workspace.handle_unique" ON "Workspace"("handle");
