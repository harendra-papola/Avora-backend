import { Request, Response, NextFunction } from "express";
import * as messageService from "../../services/conversation/message.service";

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { conversationId } = req.params as { conversationId: string };
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    const messages = await messageService.getConversationMessages(
      conversationId,
      limit,
      offset
    );

    res.json({
      success: true,
      message: "Messages retrieved successfully",
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { conversationId } = req.params as { conversationId: string };
    const { content } = req.body;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    const message = await messageService.sendMessage(conversationId, userId, {
      conversationId,
      content,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

export const editMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { messageId } = req.params as { messageId: string };
    const { content } = req.body;

    if (!messageId) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required",
      });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    const updatedMessage = await messageService.editMessage(messageId, userId, {
      content,
    });

    res.json({
      success: true,
      message: "Message edited successfully",
      data: updatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { messageId } = req.params as { messageId: string };

    if (!messageId) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required",
      });
    }

    const deletedMessage = await messageService.deleteMessage(messageId, userId);

    res.json({
      success: true,
      message: "Message deleted successfully",
      data: deletedMessage,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMessageStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { messageId } = req.params as { messageId: string };
    const { status } = req.body;

    if (!messageId) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required",
      });
    }

    if (!status || !["SENT", "DELIVERED", "READ"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid status is required (SENT, DELIVERED, READ)",
      });
    }

    const updatedMessage = await messageService.updateMessageStatus(messageId, {
      messageId,
      status,
    });

    res.json({
      success: true,
      message: "Message status updated successfully",
      data: updatedMessage,
    });
  } catch (error) {
    next(error);
  }
};
