/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `License` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "License_url_key" ON "License"("url");
