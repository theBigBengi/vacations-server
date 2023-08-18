import * as MySQLConnector from "./data/mysql/db";
require("dotenv").config();
import logger from "./utils/logger";

process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  logger.error(`${err.name}, ${err.message}`);
  process.exit(1);
});

import { app } from "./app";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

// create database pool
MySQLConnector.init();

const folderPath = "./public/images";

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  // Create images folder if it doesn't exist
  if (!existsSync(folderPath)) {
    mkdirSync(folderPath, { recursive: true });
    logger.info("Images folder created successfully.");
  }

  logger.info(`App running on port ${port}.`);
});

process.on("unhandledRejection", (err: any) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
  logger.error(`${err.name}, ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  logger.info("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    logger.error("💥 Process terminated!");
  });
});
