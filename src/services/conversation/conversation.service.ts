import { CreateConversationDto } from "../../dto/conversation/conversation.dto";
import * as conversationRepository from "../../repositories/conversation/conversation.repository";

export const createConversation = async (
  currentUserId: number,
  data: CreateConversationDto
) => {
  const { participantId } = data;

  if (currentUserId === participantId) {
    throw new Error("You cannot create a conversation with yourself");
  }

  const existingConversation =
    await conversationRepository.findExistingConversation(
      currentUserId,
      participantId
    );

  if (existingConversation) {
    return existingConversation;
  }

const newConversation = await conversationRepository.createConversation(
    currentUserId,
    participantId
  );

  return newConversation;
};

export const getUserConversations = async (userId: number) => {
  return conversationRepository.getUserConversations(userId);
};

export const getConversation = async (conversationId: string) => {
  const conversation = await conversationRepository.getConversationById(conversationId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }
  return conversation;
};