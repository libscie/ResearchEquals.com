/*
  Warnings:

  - A unique constraint covering the columns `[orcid]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Workspace.orcid_unique" ON "Workspace"("orcid");
