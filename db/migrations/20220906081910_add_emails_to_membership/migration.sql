-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "emailApprovals" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "emailInvitations" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "emailWeeklyDigest" BOOLEAN NOT NULL DEFAULT true;
