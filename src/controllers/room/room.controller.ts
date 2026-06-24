import { Request, Response, NextFunction } from "express";
import * as roomService from "../../services/room/room.service";

export const createToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const body = req.body || {};
    const type = body.type !== undefined ? body.type : 1; 
    const coHostId = body.coHostId;

    
    const result = await roomService.createToken(
      userId,
      type,
      coHostId
    );  

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const joinRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const {
      roomName,
      type = "viewer",
    }: {
      roomName: string;
      type?: "viewer" | "audio" | "video";
    } = req.body;

    const result = await roomService.joinRoom(
      userId,
      roomName,
      type
    );

    return res.status(200).json({
      success: true,
      message: "Room joined successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getLiveRooms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rooms =
      await roomService.getLiveRooms();

    return res.status(200).json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { roomName } = req.body;

    await roomService.deleteRoom(
      userId,
      roomName
    );

    return res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};