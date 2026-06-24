import prisma from "../../config/prisma";
import { CreateMessageDto, UpdateMessageDto, UpdateMessageStatusDto } from "../../dto/conversation/message.dto";

export const createMessage = async (
  conversationId: string,
  senderId: number,
  data: CreateMessageDto
) => {
  return prisma.message.create({
    data: {
      conversationId,
      senderId,
      content: data.content,
      status: "SENT",
    },
    include: {
      sender: {
        select: {
          id: true,
          userName: true,
          profilePic: true,
        },
      },
    },
  });
};


export const getMessagesByConversation = async (
  conversationId: string,
  limit: number = 50,
  offset: number = 0
) => {
  const messages = await prisma.message.findMany({
    where: {
      conversationId,
      isDeleted: false, 
    },
    select: {
      id: true,
      conversationId: true,
      senderId: true,
      content: true,
      status: true,
      isEdited: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc", 
    },
    take: limit,
    skip: offset,
  });

  return messages.reverse();
};

export const getMessageById = async (messageId: string) => {
  return prisma.message.findUnique({
    where: { id: messageId },
    include: {
      sender: {
        select: {
          id: true,
          userName: true,
          profilePic: true,
        },
      },
    },
  });
};

export const updateMessage = async (
  messageId: string,
  data: UpdateMessageDto
) => {
  return prisma.message.update({
    where: { id: messageId },
    data: {
      content: data.content,
      isEdited: true,
      updatedAt: new Date(),
    },
    include: {
      sender: {
        select: {
          id: true,
          userName: true,
          profilePic: true,
        },
      },
    },
  });
};

export const updateMessageStatus = async (
  messageId: string,
  data: UpdateMessageStatusDto
) => {
  return prisma.message.update({
    where: { id: messageId },
    data: {
      status: data.status,
      updatedAt: new Date(),
    },
    include: {
      sender: {
        select: {
          id: true,
          userName: true,
          profilePic: true,
        },
      },
    },
  });
};

export const softDeleteMessage = async (messageId: string) => {
  return prisma.message.update({
    where: { id: messageId },
    data: {
      isDeleted: true,
      updatedAt: new Date(),
    },
    include: {
      sender: {
        select: {
          id: true,
          userName: true,
          profilePic: true,
        },
      },
    },
  });
};

export const getConversationMessages = async (conversationId: string) => {
  return prisma.message.count({
    where: {
      conversationId,
      isDeleted: false,
    },
  });
};

export const updateLastMessage = async (
  conversationId: string,
  lastMessage: string
) => {
  return prisma.conversation.update({
    where: { id: conversationId },
    data: {
      lastMessage,
      lastMessageAt: new Date(),
    },
  });
};
