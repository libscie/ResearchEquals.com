-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "workspaceId" INTEGER;

-- CreateTable
CREATE TABLE "_WorkspaceToWorkspace" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_WorkspaceToWorkspace_AB_unique" ON "_WorkspaceToWorkspace"("A", "B");

-- CreateIndex
CREATE INDEX "_WorkspaceToWorkspace_B_index" ON "_WorkspaceToWorkspace"("B");

-- AddForeignKey
ALTER TABLE "Workspace" ADD FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkspaceToWorkspace" ADD FOREIGN KEY ("A") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkspaceToWorkspace" ADD FOREIGN KEY ("B") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
