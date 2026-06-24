// repositories/room/room.repository.ts

import prisma from "../../config/prisma";
import { RoomDto } from "../../dto/room/room.dto";

export const setRoomDetail = async (
  data: RoomDto
) => {
  return prisma.room.create({
    data,
  });
};

export const getRoomByName = async (
  roomName: string
) => {
  return prisma.room.findUnique({
    where: {
      roomName,
    },
  });
};

export const getLiveRooms = async () => {
  return prisma.room.findMany({
    where: {
      isLive: true,
      type: "LIVE_STREAM",
    },
    include: {
      host: {
        select: {
          id: true,
          userName: true,
          profilePic: true,
        },
      },
    },
    orderBy: {
      startedAt: "desc",
    },
  });
};

export const deleteRoom = async (
  roomName: string
) => {
  return prisma.room.delete({
    where: {
      roomName,
    },
  });
};