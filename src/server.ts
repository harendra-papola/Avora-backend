import app from "./app";
import { connectDb } from "./config/database";
import { otpCleanup } from "./services/auth/auth.service";
import { logger } from "./utils/Logger";
import https from "https";
import fs from "fs";
import path from "path";
import { initSocket } from "./Socket";
import { validateEnv, envConfig } from "./config/env";

// Validate environment variables on startup
validateEnv();

const PORT = envConfig.server.port;

const startServer = async () => {
  try {
    await connectDb();
    otpCleanup();

    const httpsOptions = {
      key: fs.readFileSync(
        path.join(__dirname, "../certs/localhost-key.pem")
      ),
      cert: fs.readFileSync(
        path.join(__dirname, "../certs/localhost.pem")
      ),
    };

    const server = https.createServer(httpsOptions, app);

    // Initialize Socket.IO
    initSocket(server);

    server.listen(PORT, () => {
      logger.success(
        `HTTPS Server running on https://localhost:${PORT}`
      );
    });

    process.on("SIGINT", () => {
      logger.info("Shutting down server...");

      server.close(() => {
        logger.success("Server closed");
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error("Failed to connect to the database", error);
    process.exit(1);
  }
};

startServer();