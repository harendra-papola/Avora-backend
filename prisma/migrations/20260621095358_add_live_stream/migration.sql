-- CreateTable
CREATE TABLE "LiveStream" (
    "id" TEXT NOT NULL,
    "hostId" INTEGER NOT NULL,
    "roomName" TEXT NOT NULL,
    "title" TEXT,
    "thumbnail" TEXT,
    "isLive" BOOLEAN NOT NULL DEFAULT true,
    "viewerCount" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveStream_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LiveStream_roomName_key" ON "LiveStream"("roomName");

-- CreateIndex
CREATE INDEX "LiveStream_hostId_idx" ON "LiveStream"("hostId");

-- CreateIndex
CREATE INDEX "LiveStream_isLive_idx" ON "LiveStream"("isLive");

-- AddForeignKey
ALTER TABLE "LiveStream" ADD CONSTRAINT "LiveStream_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
