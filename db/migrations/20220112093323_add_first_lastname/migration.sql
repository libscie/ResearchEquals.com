-- CreateEnum
CREATE TYPE "WorkspaceType" AS ENUM ('Individual', 'Group');

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "workspaceType" "WorkspaceType" NOT NULL DEFAULT E'Individual';
