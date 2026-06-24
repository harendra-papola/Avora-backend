import { Socket } from "socket.io";
import { verifyToken } from "../../utils/jwt";
import { findUserById } from "../../repositories/auth/auth.repository";
import { UnauthorizedError } from "../../utils/error";

export const authenticateSocket = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      throw new UnauthorizedError("Token not found");
    }

    const decoded = verifyToken(token);

    if (!decoded?.userId || !decoded?.sessionId) {
      throw new UnauthorizedError("Invalid token payload");
    }

    const user = await findUserById(decoded.userId);

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    if (user.sessionId !== decoded.sessionId) {
      throw new UnauthorizedError("Session expired");
    }

    socket.data.userId = user.id;
    socket.data.userName = user.userName;
    socket.data.profilePic=user.profilePic;

    next();
  } catch (error) {
    next(
      error instanceof Error
        ? error
        : new UnauthorizedError("Authentication failed")
    );
  }
};