import { Socket } from "socket.io";
import { verifyToken } from "../../utils/jwt";
import { findUserById } from "../../repositories/auth/auth.repository";
import { UnauthorizedError } from "../../utils/error";

export const authenticateSocket = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    console.log("Socket Connected");
    console.log("User ID:", socket.data.userId);
    const token = socket.handshake.auth?.token;

    if (!token) {
      throw new UnauthorizedError("Token not found");
    }

    const decoded = verifyToken(token);
    console.log("Decoded:", decoded);
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
    console.log("Authenticated user:", socket.data.userId);
    next();
  } catch (error) {
    next(
      error instanceof Error
        ? error
        : new UnauthorizedError("Authentication failed")
    );
  }
};