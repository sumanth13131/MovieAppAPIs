import { createLogger } from "winston";
import winston from "winston";
import * as path from "path";
import DailyRotateFile from "winston-daily-rotate-file";

let logger = createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new DailyRotateFile({
            name: "file#info",
            level: "info",
            filename: path.join(process.cwd(), "Logging", "Logs", "info.log"),
            datePattern: ".MM--dd-yyyy",
        }),
        new DailyRotateFile({
            name: "file#error",
            level: "error",
            filename: path.join(process.cwd(), "Logging", "Logs", "error.log"),
            datePattern: ".MM--dd-yyyy",
            handleExceptions: true,
        }),
    ],
});

export default logger;
