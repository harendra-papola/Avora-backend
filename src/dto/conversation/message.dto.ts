export interface CreateMessageDto {
  conversationId: string;
  content: string;
}

export interface UpdateMessageDto {
  content: string;
}

export interface MessageResponseDto {
  id: string;
  conversationId: string;
  senderId: number;
  content: string;
  status: "SENT" | "DELIVERED" | "READ";
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  sender: {
    id: number;
    userName: string;
    profilePic: string | null;
  };
}

export interface GetMessagesDto {
  conversationId: string;
  limit?: number;
  offset?: number;
}

export interface UpdateMessageStatusDto {
  messageId: string;
  status: "SENT" | "DELIVERED" | "READ";
}

export interface DeleteMessageDto {
  messageId: string;
}
