import prisma from "../../config/prisma";

export const findExistingConversation = async (
  userId1: number,
  userId2: number
) => {
  return await prisma.conversation.findFirst({
    where: {
      type: "DIRECT", // ✅ Matches your ConversationType enum
      AND: [
        {
          participants: {
            some: { userId: userId1 },
          },
        },
        {
          participants: {
            some: { userId: userId2 },
          },
        },
      ],
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              userName: true,
              profilePic: true,
            },
          },
        },
      },
    },
  });
};

export const createConversation = async (
  userId1: number,
  userId2: number
) => {
  return await prisma.conversation.create({
    data: {
      type: "DIRECT", // ✅ Hardcoded as DIRECT for your 1-on-1 first message generation
      participants: {
        create: [
          { userId: userId1 },
          { userId: userId2 },
        ],
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              userName: true,
              profilePic: true,
            },
          },
        },
      },
    },
  });
};

export const getConversationById = async (conversationId: string) => {
  return prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              userName: true,
              profilePic: true,
            },
          },
        },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
        include: {
          sender: {
            select: {
              id: true,
              userName: true,
              profilePic: true,
            },
          },
        },
      },
    },
  });
};

export const getUserConversations = async (userId: number) => {
  return prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              userName: true,
              profilePic: true,
              bio: true,
            },
          },
        },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
        include: {
          sender: {
            select: {
              id: true,
              userName: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};