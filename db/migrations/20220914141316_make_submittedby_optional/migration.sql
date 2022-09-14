-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_workspaceId_fkey";

-- AlterTable
ALTER TABLE "Submission" ALTER COLUMN "workspaceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
