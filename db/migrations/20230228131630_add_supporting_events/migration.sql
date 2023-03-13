-- CreateEnum
CREATE TYPE "SupportingEvent" AS ENUM ('ASSEMBLY', 'REQUEST', 'PETITION');

-- CreateTable
CREATE TABLE "SupportingEvents" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "SupportingEvent" NOT NULL DEFAULT 'ASSEMBLY',
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "attachments" JSONB DEFAULT '{"files": []}',

    CONSTRAINT "SupportingEvents_pkey" PRIMARY KEY ("id")
);
