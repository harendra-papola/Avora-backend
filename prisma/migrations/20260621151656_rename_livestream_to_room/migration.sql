/*
  Warnings:

  - You are about to drop the `LiveStream` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StreamType" AS ENUM ('LIVE_STREAM', 'AUDIO_CALL', 'VIDEO_CALL', 'AUDIO_ROOM');

-- DropForeignKey
ALTER TABLE "LiveStream" DROP CONSTRAINT "LiveStream_hostId_fkey";

-- DropTable
DROP TABLE "LiveStream";

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "hostId" INTEGER NOT NULL,
    "roomName" TEXT NOT NULL,
    "title" TEXT,
    "thumbnail" TEXT,
    "type" "StreamType" NOT NULL,
    "isLive" BOOLEAN NOT NULL DEFAULT true,
    "viewerCount" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomName_key" ON "Room"("roomName");

-- CreateIndex
CREATE INDEX "Room_hostId_idx" ON "Room"("hostId");

-- CreateIndex
CREATE INDEX "Room_isLive_idx" ON "Room"("isLive");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
