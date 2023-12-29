import winston from "winston";
import config from "./config/config.js";

const devLogger = winston.createLogger({
  level: "silly",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

const prodLogger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "info.log" }),
    new winston.transports.File({ filename: "errors.log", level: "error" }),
  ],
});

export const logger = config.NODE_ENV === "production" ? prodLogger : devLogger;
