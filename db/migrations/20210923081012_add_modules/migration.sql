-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "suffix" TEXT NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "description" TEXT,
    "license" TEXT,
    "type" TEXT NOT NULL,
    "main" TEXT NOT NULL,
    "moduleId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ModuleToWorkspace" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Module.suffix_unique" ON "Module"("suffix");

-- CreateIndex
CREATE UNIQUE INDEX "_ModuleToWorkspace_AB_unique" ON "_ModuleToWorkspace"("A", "B");

-- CreateIndex
CREATE INDEX "_ModuleToWorkspace_B_index" ON "_ModuleToWorkspace"("B");

-- AddForeignKey
ALTER TABLE "Module" ADD FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModuleToWorkspace" ADD FOREIGN KEY ("A") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModuleToWorkspace" ADD FOREIGN KEY ("B") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
