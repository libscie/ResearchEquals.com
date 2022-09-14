/*
  Warnings:

  - You are about to drop the `ReleaseList` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CollectionTypes" AS ENUM ('INDIVIDUAL', 'COLLABORATIVE', 'COMMUNITY');

-- DropTable
DROP TABLE "ReleaseList";

-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accepted" BOOLEAN,
    "collectionId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "comment" VARCHAR(280) NOT NULL,
    "editorshipId" INTEGER NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "pinPosition" INTEGER,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "finishedAt" TIMESTAMP(3),
    "collectionTypeId" INTEGER NOT NULL,
    "suffix" TEXT,
    "icon" JSONB,
    "header" JSONB,
    "title" TEXT,
    "subtitle" TEXT,
    "description" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionType" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "CollectionTypes" NOT NULL,
    "price" INTEGER,
    "price_id" TEXT,

    CONSTRAINT "CollectionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Editorship" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "MembershipRole" NOT NULL DEFAULT 'USER',
    "collectionId" INTEGER NOT NULL,
    "workspaceId" INTEGER NOT NULL,

    CONSTRAINT "Editorship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_WorkspaceToCollection" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Submission_collectionId_pinPosition_key" ON "Submission"("collectionId", "pinPosition");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_suffix_key" ON "Collection"("suffix");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionType_type_key" ON "CollectionType"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Editorship_workspaceId_collectionId_key" ON "Editorship"("workspaceId", "collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "_WorkspaceToCollection_AB_unique" ON "_WorkspaceToCollection"("A", "B");

-- CreateIndex
CREATE INDEX "_WorkspaceToCollection_B_index" ON "_WorkspaceToCollection"("B");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_editorshipId_fkey" FOREIGN KEY ("editorshipId") REFERENCES "Editorship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_collectionTypeId_fkey" FOREIGN KEY ("collectionTypeId") REFERENCES "CollectionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Editorship" ADD CONSTRAINT "Editorship_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Editorship" ADD CONSTRAINT "Editorship_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkspaceToCollection" ADD CONSTRAINT "_WorkspaceToCollection_A_fkey" FOREIGN KEY ("A") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkspaceToCollection" ADD CONSTRAINT "_WorkspaceToCollection_B_fkey" FOREIGN KEY ("B") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
