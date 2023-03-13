/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `SupportingEvents` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SupportingEvents_slug_key" ON "SupportingEvents"("slug");
