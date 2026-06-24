import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError";

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if(error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error"
    });
};