import * as messageRepository from "../../repositories/conversation/message.repository";
import * as conversationRepository from "../../repositories/conversation/conversation.repository";
import { CreateMessageDto, UpdateMessageDto, UpdateMessageStatusDto } from "../../dto/conversation/message.dto";

export const sendMessage = async (
  conversationIdOrUserId: string,
  senderId: number,
  data: CreateMessageDto
) => {
  if (!data.content || data.content.trim().length === 0) {
    throw new Error("Message content cannot be blank");
  }

  let finalConversationId: string;

  const isNumericUserId = /^\d+$/.test(conversationIdOrUserId);

  if (isNumericUserId) {
    const recipientUserId = Number(conversationIdOrUserId);

    if (senderId === recipientUserId) {
      throw new Error("You cannot send a message to yourself");
    }

    let conversation = await conversationRepository.findExistingConversation(
      senderId,
      recipientUserId
    );

    if (!conversation) {
      conversation = await conversationRepository.createConversation(
        senderId,
        recipientUserId
      );
    }

    finalConversationId = conversation.id;
  } else {
    const conversation = await conversationRepository.getConversationById(conversationIdOrUserId);
    if (!conversation) {
      throw new Error("Conversation space not found");
    }

    const isParticipant = conversation.participants.some(p => p.userId === senderId);
    if (!isParticipant) {
      throw new Error("You are not authorized to message inside this conversation room");
    }

    finalConversationId = conversation.id;
  }

  const message = await messageRepository.createMessage(
    finalConversationId,
    senderId,
    data
  );

  await messageRepository.updateLastMessage(finalConversationId, data.content.trim());

  return message;
};

export const getConversationMessages = async (
  conversationId: string,
  limit: number = 50,
  offset: number = 0
) => {
  const messages = await messageRepository.getMessagesByConversation(
    conversationId,
    limit,
    offset
  );

  if (!messages) {
    throw new Error("Failed to retrieve messages");
  }

  return messages;
};

export const editMessage = async (
  messageId: string,
  senderId: number,
  data: UpdateMessageDto
) => {
  const message = await messageRepository.getMessageById(messageId);
  if (!message) {
    throw new Error("Message not found");
  }

  if (message.senderId !== senderId) {
    throw new Error("You can only edit your own messages");
  }

  if (message.isDeleted) {
    throw new Error("Cannot edit a deleted message");
  }

  return messageRepository.updateMessage(messageId, data);
};

export const deleteMessage = async (
  messageId: string,
  userId: number
) => {
  const message = await messageRepository.getMessageById(messageId);
  if (!message) {
    throw new Error("Message not found");
  }

  if (message.senderId !== userId) {
    throw new Error("You can only delete your own messages");
  }

  return messageRepository.softDeleteMessage(messageId);
};

export const updateMessageStatus = async (
  messageId: string,
  data: UpdateMessageStatusDto
) => {
  const message = await messageRepository.getMessageById(messageId);
  if (!message) {
    throw new Error("Message not found");
  }

  return messageRepository.updateMessageStatus(messageId, data);
};
