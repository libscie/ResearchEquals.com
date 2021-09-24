-- CreateTable
CREATE TABLE "_ModuleToModule" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ModuleToModule_AB_unique" ON "_ModuleToModule"("A", "B");

-- CreateIndex
CREATE INDEX "_ModuleToModule_B_index" ON "_ModuleToModule"("B");

-- AddForeignKey
ALTER TABLE "_ModuleToModule" ADD FOREIGN KEY ("A") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModuleToModule" ADD FOREIGN KEY ("B") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
