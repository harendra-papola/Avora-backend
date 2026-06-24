import { Socket, Server } from "socket.io";
import { MESSAGE_EVENTS, USER_EVENTS, CONVERSATION_EVENTS, ERROR_EVENTS, LIVE_CHAT_EVENTS, CALL_EVENTS } from "../constants/socket.events";
import * as messageService from "../services/conversation/message.service";
interface OnlineUser {
  userId: number;
  userName: string;
  profilePic: string | null;
  socketId: string;
}
// userId -> socketId mapping
const onlineUsers = new Map<number, OnlineUser>();

// conversationId -> Set of socketIds
const conversationRooms = new Map<string, Set<string>>();

// Track typing status: conversationId -> Set of typing userIds
const typingUsers = new Map<string, Set<number>>();

export const handleSocketConnection = (io: Server, socket: Socket) => {

const userId = socket.data.userId;

 onlineUsers.set(userId, {
  userId,
  userName: socket.data.userName,
  profilePic: socket.data.profilePic,
  socketId: socket.id,
});
  
io.emit(
  USER_EVENTS.ONLINE_USERS,
  Array.from(onlineUsers.values())
);
  // MESSAGE EVENTS

  socket.on(CONVERSATION_EVENTS.CREATE, (data: { conversationId: string }) => {
    try {
      const { conversationId } = data;
      const userId = socket.data.userId;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      socket.join(`conversation:${conversationId}`);

      // Add socket to conversation room tracking
      if (!conversationRooms.has(conversationId)) {
        conversationRooms.set(conversationId, new Set());
      }
      conversationRooms.get(conversationId)!.add(socket.id);

      console.log(
        `[Socket] User ${userId} joined conversation ${conversationId}`
      );

      // Notify others that user is now in this conversation
      socket.to(`conversation:${conversationId}`).emit(USER_EVENTS.ONLINE, {
        userId,
        conversationId,
      });
    } catch (error) {
      socket.emit(ERROR_EVENTS.ERROR, {
        message: "Failed to join conversation",
        error,
      });
    }
  });

  // Send message

  socket.on(
    MESSAGE_EVENTS.SEND,
    async (data: { conversationId: string; content: string }, callback) => {
      try {
        const { conversationId, content } = data;
        const userId = socket.data.userId;

        if (!userId) {
          throw new Error("User not authenticated");
        }

        if (!content || content.trim().length === 0) {
          throw new Error("Message content cannot be empty");
        }

        const message = await messageService.sendMessage(conversationId, userId, {
          conversationId,
          content,
        });

        // Emit to all users in the conversation
        io.to(`conversation:${conversationId}`).emit(MESSAGE_EVENTS.RECEIVE, {
          id: message.id,
          conversationId,
          senderId: message.senderId,
          content: message.content,
          status: message.status,
          isEdited: message.isEdited,
          isDeleted: message.isDeleted,
          createdAt: message.createdAt,
          sender: message.sender,
        });

        // Send acknowledgment
        if (callback) {
          callback({
            success: true,
            messageId: message.id,
          });
        }
      } catch (error) {
        if (callback) {
          callback({
            success: false,
            error: error instanceof Error ? error.message : "Failed to send message",
          });
        } else {
          socket.emit(ERROR_EVENTS.MESSAGE_ERROR, {
            message: "Failed to send message",
            error,
          });
        }
      }
    }
  );

  // Edit message
  socket.on(
    MESSAGE_EVENTS.EDIT,
    async (data: { messageId: string; content: string; conversationId: string }, callback) => {
      try {
        const { messageId, content, conversationId } = data;
        const userId = socket.data.userId;

        if (!userId) {
          throw new Error("User not authenticated");
        }

        if (!content || content.trim().length === 0) {
          throw new Error("Message content cannot be empty");
        }

        const updatedMessage = await messageService.editMessage(messageId, userId, {
          content,
        });

        // Emit to all users in the conversation
        io.to(`conversation:${conversationId}`).emit(MESSAGE_EVENTS.EDIT, {
          id: updatedMessage.id,
          conversationId,
          content: updatedMessage.content,
          isEdited: updatedMessage.isEdited,
          updatedAt: updatedMessage.updatedAt,
        });

        if (callback) {
          callback({ success: true });
        }
      } catch (error) {
        if (callback) {
          callback({
            success: false,
            error: error instanceof Error ? error.message : "Failed to edit message",
          });
        } else {
          socket.emit(ERROR_EVENTS.MESSAGE_ERROR, {
            message: "Failed to edit message",
            error,
          });
        }
      }
    }
  );

  // Delete message
  socket.on(
    MESSAGE_EVENTS.DELETE,
    async (data: { messageId: string; conversationId: string }, callback) => {
      try {
        const { messageId, conversationId } = data;
        const userId = socket.data.userId;

        if (!userId) {
          throw new Error("User not authenticated");
        }

        await messageService.deleteMessage(messageId, userId);

        // Emit to all users in the conversation
        io.to(`conversation:${conversationId}`).emit(MESSAGE_EVENTS.DELETE, {
          messageId,
          conversationId,
        });

        if (callback) {
          callback({ success: true });
        }
      } catch (error) {
        if (callback) {
          callback({
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete message",
          });
        } else {
          socket.emit(ERROR_EVENTS.MESSAGE_ERROR, {
            message: "Failed to delete message",
            error,
          });
        }
      }
    }
  );

  // Update message status
  socket.on(
    MESSAGE_EVENTS.STATUS_UPDATE,
    async (data: { messageId: string; status: string; conversationId: string }, callback) => {
      try {
        const { messageId, status, conversationId } = data;

        if (!["SENT", "DELIVERED", "READ"].includes(status)) {
          throw new Error("Invalid status");
        }

        await messageService.updateMessageStatus(messageId, {
          messageId,
          status: status as "SENT" | "DELIVERED" | "READ",
        });

        // Emit to all users in the conversation
        io.to(`conversation:${conversationId}`).emit(MESSAGE_EVENTS.STATUS_UPDATE, {
          messageId,
          status,
        });

        if (callback) {
          callback({ success: true });
        }
      } catch (error) {
        if (callback) {
          callback({
            success: false,
            error: error instanceof Error ? error.message : "Failed to update message status",
          });
        } else {
          socket.emit(ERROR_EVENTS.MESSAGE_ERROR, {
            message: "Failed to update message status",
            error,
          });
        }
      }
    }
  );

  // Load messages
  socket.on(
    MESSAGE_EVENTS.LOAD_MESSAGES,
    async (data: { conversationId: string; limit: number; offset: number }, callback) => {
      try {
        const { conversationId, limit = 50, offset = 0 } = data;
        const userId = socket.data.userId;

        if (!userId) {
          throw new Error("User not authenticated");
        }

        const messages = await messageService.getConversationMessages(
          conversationId,
          limit,
          offset
        );

        socket.emit(MESSAGE_EVENTS.MESSAGES_LOADED, {
          conversationId,
          messages,
          count: messages.length,
        });
      } catch (error) {
        socket.emit(ERROR_EVENTS.MESSAGE_ERROR, {
          message: "Failed to load messages",
          error,
        });
      }
    }
  );

  // ==================== TYPING INDICATORS ====================

  socket.on(USER_EVENTS.TYPING, (data: { conversationId: string }) => {
    try {
      const { conversationId } = data;
      const userId = socket.data.userId;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      if (!typingUsers.has(conversationId)) {
        typingUsers.set(conversationId, new Set());
      }
      typingUsers.get(conversationId)!.add(userId);

      // Emit typing status to all users in the conversation except sender
      socket.to(`conversation:${conversationId}`).emit(USER_EVENTS.TYPING, {
        userId,
        conversationId,
      });
    } catch (error) {
      socket.emit(ERROR_EVENTS.ERROR, {
        message: "Typing notification failed",
        error,
      });
    }
  });

  socket.on(USER_EVENTS.STOP_TYPING, (data: { conversationId: string }) => {
    try {
      const { conversationId } = data;
      const userId = socket.data.userId;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const typing = typingUsers.get(conversationId);
      if (typing) {
        typing.delete(userId);
        if (typing.size === 0) {
          typingUsers.delete(conversationId);
        }
      }

      // Emit stop typing status to all users in the conversation except sender
      socket.to(`conversation:${conversationId}`).emit(USER_EVENTS.STOP_TYPING, {
        userId,
        conversationId,
      });
    } catch (error) {
      socket.emit(ERROR_EVENTS.ERROR, {
        message: "Stop typing notification failed",
        error,
      });
    }
  });

  // DISCONNECT

  socket.on("disconnect", () => {
    const userId = socket.data.userId;

    if (userId) {
      onlineUsers.delete(userId);
      console.log(`[Socket] User ${userId} disconnected. Online users:`, Array.from(onlineUsers.keys()));

      // Broadcast user offline status
      io.emit(USER_EVENTS.ONLINE_USERS,Array.from(onlineUsers.values()));
      // io.emit(USER_EVENTS.OFFLINE, { userId, socketId: socket.id, onlineCount: onlineUsers.size });
    }

    // Remove from conversation rooms
    for (const [conversationId, socketIds] of conversationRooms.entries()) {
      socketIds.delete(socket.id);
      if (socketIds.size === 0) {
        conversationRooms.delete(conversationId);
      }
    }

    // Remove from typing users
    for (const [conversationId, userIds] of typingUsers.entries()) {
      userIds.delete(userId);
      if (userIds.size === 0) {
        typingUsers.delete(conversationId);
      }
    }
  });

  // Error handling
  socket.on("error", (error) => {
    console.error(`[Socket] Error: ${error}`);
    socket.emit(ERROR_EVENTS.ERROR, {
      message: "Socket error occurred",
      error,
    });
  });

  // livechat
  socket.on(
  LIVE_CHAT_EVENTS.JOIN,
  (roomName: string) => {
    socket.join(roomName);
  }
);

socket.on(
  LIVE_CHAT_EVENTS.LEAVE,
  (roomName: string) => {
    socket.leave(roomName);
  }
);

socket.on(
  LIVE_CHAT_EVENTS.SEND,
  (data) => {
    io.to(data.roomName).emit(
      LIVE_CHAT_EVENTS.RECEIVE,
      {
        userId: socket.data.userId,
        userName: data.userName,
        message: data.message,
        isHost:data.isHost,
        createdAt: new Date(),
      }
    );
  }
);

socket.on(
  CALL_EVENTS.REQUEST,
  (data) => {
    const receiver =onlineUsers.get(data.receiverId);

if (!receiver) {
  return;
}

io.to(receiver.socketId).emit(
  CALL_EVENTS.REQUEST,
  data
);
  }
);

socket.on(
  CALL_EVENTS.ACCEPT,
  (data) => {
    const caller =
      onlineUsers.get(
        data.callerId
      );

    if (!caller) {
      return;
    }

    io.to(caller.socketId).emit(
      CALL_EVENTS.ACCEPT,
      data
    );
  }
);

socket.on(
  CALL_EVENTS.REJECT,
  (data) => {
    const caller =onlineUsers.get(  data.receiverId);

    if (!caller) {
      return;
    }

    io.to(caller.socketId).emit(
      CALL_EVENTS.REJECT,
      data
    );
  }
);

socket.on(
  CALL_EVENTS.END,
  (data) => {
    const otherUser =
      onlineUsers.get(
        data.receiverId
      );

    if (!otherUser) {
      return;
    }

    io.to(otherUser.socketId).emit(
      CALL_EVENTS.END,
      data
    );
  }
);

//call_EVENTS

};

export { onlineUsers, conversationRooms, typingUsers };
