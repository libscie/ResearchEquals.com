/*
  Warnings:

  - A unique constraint covering the columns `[url,name]` on the table `License` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Authorship" DROP CONSTRAINT "Authorship_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Module" DROP CONSTRAINT "Module_moduleTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_userId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "License_url_name_key" ON "License"("url", "name");

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_moduleTypeId_fkey" FOREIGN KEY ("moduleTypeId") REFERENCES "ModuleType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authorship" ADD CONSTRAINT "Authorship_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Authorship.moduleId_workspaceId_unique" RENAME TO "Authorship_moduleId_workspaceId_key";

-- RenameIndex
ALTER INDEX "Membership.workspaceId_invitedEmail_unique" RENAME TO "Membership_workspaceId_invitedEmail_key";

-- RenameIndex
ALTER INDEX "Module.suffix_unique" RENAME TO "Module_suffix_key";

-- RenameIndex
ALTER INDEX "Session.handle_unique" RENAME TO "Session_handle_key";

-- RenameIndex
ALTER INDEX "Token.hashedToken_type_unique" RENAME TO "Token_hashedToken_type_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";

-- RenameIndex
ALTER INDEX "Workspace.handle_unique" RENAME TO "Workspace_handle_key";

-- RenameIndex
ALTER INDEX "Workspace.orcid_unique" RENAME TO "Workspace_orcid_key";
