import { Request, Response, NextFunction } from "express";
import * as userService from "../../services/user/user.service";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const users = await userService.getUsers(userId);
         res.json({
      success: true,
      message: "Users list retrieved successfully",
      data: users,
    });
    } catch (error) {
        next(error);
    }
};


