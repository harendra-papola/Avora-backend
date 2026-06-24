// controllers/call/call.controller.ts

import { Request, Response, NextFunction } from "express";
import * as callService from "../../services/call/call.service";

export const createCall = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const callerId = req.user!.userId;
    const { receiverId, callType } =
      req.body;

    const call =
      await callService.createCall(
        callerId,
        receiverId,
        callType
      );

    return res.status(201).json({
      success: true,
      data: call,
    });
  } catch (error) {
    next(error);
  }
};

export const endCall = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const callId = Number(
      req.params.callId
    );

    const { duration } = req.body;

    const call =
      await callService.endCall(
        callId,
        duration
      );

    return res.status(200).json({
      success: true,
      data: call,
    });
  } catch (error) {
    next(error);
  }
};

export const markMissedCall =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const callId = Number(
        req.params.callId
      );

      const call =
        await callService.markMissedCall(
          callId
        );

      return res.status(200).json({
        success: true,
        data: call,
      });
    } catch (error) {
      next(error);
    }
  };

export const getCallHistory =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId =
        req.user!.userId;

      const history =
        await callService.getCallHistory(
          userId
        );

      return res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  };

export const deleteCallHistory =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const callId = Number(
        req.params.callId
      );

      await callService.deleteCallHistory(
        callId
      );

      return res.status(200).json({
        success: true,
        message:
          "Call history deleted",
      });
    } catch (error) {
      next(error);
    }
  };