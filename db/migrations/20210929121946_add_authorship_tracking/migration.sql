/*
  Warnings:

  - You are about to drop the column `invitedWorkspaceId` on the `Authorship` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[moduleId,workspaceId]` on the table `Authorship` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Authorship` table without a default value. This is not possible if the table is not empty.
  - Made the column `workspaceId` on table `Authorship` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Authorship.moduleId_invitedWorkspaceId_unique";

-- AlterTable
ALTER TABLE "Authorship" DROP COLUMN "invitedWorkspaceId",
ADD COLUMN     "acceptedInvitation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "readyToPublish" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "workspaceId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Authorship.moduleId_workspaceId_unique" ON "Authorship"("moduleId", "workspaceId");
