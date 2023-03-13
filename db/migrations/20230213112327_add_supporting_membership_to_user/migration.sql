-- AlterTable
ALTER TABLE "User" ADD COLUMN     "supportingMember" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "supportingMemberSince" TIMESTAMP(3);
