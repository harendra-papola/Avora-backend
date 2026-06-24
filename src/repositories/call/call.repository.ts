// repositories/call/call.repository.ts

import prisma from "../../config/prisma";

export const createCall = async (
  data: any
) => {
  return prisma.callHistory.create({
    data,
  });
};

export const endCall = async (
  callId: number,
  duration: number
) => {
  return prisma.callHistory.update({
    where: {
      id: callId,
    },
    data: {
      endedAt: new Date(),
      duration,
      callStatus: "COMPLETED",
    },
  });
};

export const markMissedCall =
  async (callId: number) => {
    return prisma.callHistory.update({
      where: {
        id: callId,
      },
      data: {
        callStatus: "MISSED",
      },
    });
  };

export const getCallHistory =
  async (userId: number) => {
    return prisma.callHistory.findMany({
      where: {
        OR: [
          {
            callerId: userId,
          },
          {
            receiverId: userId,
          },
        ],
      },
      include: {
        caller: {
          select: {
            id: true,
            userName: true,
            profilePic: true,
          },
        },
        receiver: {
          select: {
            id: true,
            userName: true,
            profilePic: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  };

export const deleteCallHistory =
  async (callId: number) => {
    return prisma.callHistory.delete({
      where: {
        id: callId,
      },
    });
  };