/*
  Warnings:

  - You are about to drop the column `invitedHandle` on the `Authorship` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[moduleId,invitedWorkspaceId]` on the table `Authorship` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Authorship.moduleId_workspaceId_unique";

-- AlterTable
ALTER TABLE "Authorship" DROP COLUMN "invitedHandle",
ADD COLUMN     "invitedWorkspaceId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Authorship.moduleId_invitedWorkspaceId_unique" ON "Authorship"("moduleId", "invitedWorkspaceId");
