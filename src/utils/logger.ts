import winston, { format, transports } from "winston";
import chalk from "chalk";

enum LogLevel {
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  DEBUG = "debug",
}

interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp?: string;
}

class Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: LogLevel.INFO,
      format: format.combine(
        format.timestamp(),
        format.printf(({ level, message, timestamp }) => {
          const coloredLevel = this.getColorizedLevel(level as LogLevel);
          return `${chalk.gray(`[${timestamp}]`)} ${coloredLevel}: ${message}`;
        })
      ),
      transports: [
        new transports.Console(),
        new transports.File({
          filename: "logs/server.log",
          format: format.combine(
            format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
            format.align(),
            format.printf(
              (info) => `${info.level}: [${info.timestamp}]: ${info.message}`
            )
          ),
        }),
      ],
    });
  }

  private getColorizedLevel(level: LogLevel): string {
    switch (level) {
      case LogLevel.INFO:
        return chalk.blueBright(level);
      case LogLevel.ERROR:
        return chalk.red(level);
      case LogLevel.WARN:
        return chalk.yellow(level);
      default:
        return chalk.blueBright(level);
    }
  }

  log(logMessage: LogMessage): void {
    this.logger.log(logMessage);
  }

  info(message: string): void {
    this.log({ level: LogLevel.INFO, message });
  }

  warn(message: string): void {
    this.log({ level: LogLevel.WARN, message });
  }

  error(message: string): void {
    this.log({ level: LogLevel.ERROR, message });
  }
}

export default new Logger();
