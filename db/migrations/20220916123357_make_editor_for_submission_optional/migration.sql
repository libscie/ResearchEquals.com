-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_editorshipId_fkey";

-- AlterTable
ALTER TABLE "Submission" ALTER COLUMN "editorshipId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_editorshipId_fkey" FOREIGN KEY ("editorshipId") REFERENCES "Editorship"("id") ON DELETE SET NULL ON UPDATE CASCADE;
