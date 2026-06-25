import { Request, Response, NextFunction } from "express";
import * as authService from "../../services/auth/auth.service";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.registerUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

export const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.generateAndSendOtp(req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.login(req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export const logoutUser = async ( req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const result = await authService.logout(
            req.user.userId
        );

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const forgotPasswordController = async ( req: Request, res: Response, next: NextFunction) => {
    try {
         const result = await authService.forgotPassword(req.body);
        res.status(200).json(result);
        
    } catch (error) {
        next(error);
    }
}

export const  resetPasswordController = async ( req: Request, res: Response, next: NextFunction) => {
    try{
         const result = await authService.resetPassword(req.body);
        res.status(200).json(result);

    }catch(error){
        next(error);
    }
}