import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../../utils/jwt";
import { findUserById } from "../../repositories/auth/auth.repository";
import { UnauthorizedError } from "../../utils/error";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedError("Authorization header missing or malformed");
        }

        const token = authHeader.split(" ")[1];

        let decoded: any;
        try {
            decoded = verifyToken(token);
        } catch (jwtError) {
            throw new UnauthorizedError("Invalid or expired token");
        }

        // 3. Fetch user matching the token data
        const user = await findUserById(decoded.userId);
        if (!user) {
            throw new UnauthorizedError("User not found");
        }

        // 4. Handle session validation (Single-device login tracking)
        if (user.sessionId !== decoded.sessionId) {
            throw new UnauthorizedError("Session expired or invalidated");
        }

        // 5. Attach payload to request context and advance
        req.user = decoded;
        next();
        
    } catch (error) {
        next(error);
    }
};