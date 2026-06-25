import app from "./app";
import { connectDb } from "./config/database";
import { otpCleanup } from "./services/auth/auth.service";
import { logger } from "./utils/Logger";
import http from "http";
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

    let server: http.Server | https.Server;

    if (envConfig.isDevelopment) {
      const httpsOptions = {
        key: fs.readFileSync(
          path.join(__dirname, "../certs/localhost-key.pem")
        ),
        cert: fs.readFileSync(
          path.join(__dirname, "../certs/localhost.pem")
        ),
      };

      server = https.createServer(httpsOptions, app);

      logger.info("Starting HTTPS server (Development)");
    } else {
      server = http.createServer(app);

      logger.info("Starting HTTP server (Production)");
    }

    // Initialize Socket.IO
    initSocket(server);

    server.listen(PORT, () => {
      if (envConfig.isDevelopment) {
        logger.success(`HTTPS Server running on https://localhost:${PORT}`);
      } else {
        logger.success(`HTTP Server running on port ${PORT}`);
      }
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