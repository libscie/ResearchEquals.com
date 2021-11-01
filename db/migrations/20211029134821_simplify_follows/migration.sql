/*
  Warnings:

  - You are about to drop the column `workspaceId` on the `Workspace` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Workspace" DROP CONSTRAINT "Workspace_workspaceId_fkey";

-- AlterTable
ALTER TABLE "Workspace" DROP COLUMN "workspaceId";
