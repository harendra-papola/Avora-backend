import { Request, Response, NextFunction } from "express";
import * as conversationService from "../../services/conversation/conversation.service";

export const createConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;

    const result = await conversationService.createConversation( userId, req.body);

    res.status(201).json({
      success: true,
      message: "Conversation created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserConversations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;

    const conversations = await conversationService.getUserConversations(userId);

    res.json({
      success: true,
      message: "Conversations retrieved successfully",
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

export const getConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { conversationId } = req.params as { conversationId: string };

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    const conversation = await conversationService.getConversation(conversationId);

    res.json({
      success: true,
      message: "Conversation retrieved successfully",
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};