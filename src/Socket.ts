import { Server as HTTPSServer } from "https";
import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import { handleSocketConnection } from "./Socket/handlers";
import { authenticateSocket } from "./middlewares/auth/socket.middleware";

let io: Server | null = null;

export const initSocket = (server: HTTPSServer | HTTPServer): Server => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.use(authenticateSocket);
  io.on("connection", (socket: Socket) => {
    handleSocketConnection(io!, socket);
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io has not been initialized. Please call initSocket(server) first.");
  }

  return io;
};
