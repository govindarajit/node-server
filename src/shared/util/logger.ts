import winston from "winston";

const options: winston.LoggerOptions = {
    transports: [
        new winston.transports.Console({
            level: process.env.NODE_ENV === "production" ? "error" : "debug"
        }),
        new winston.transports.File({ filename: "log-info.log", level: "info" }),
        new winston.transports.File({ filename: "debug.log", level: "debug" }),
        new winston.transports.File({ filename: "error.log", level: "error" })
    ]
};

const logger = winston.createLogger(options);

if (process.env.NODE_ENV !== "production") {
    logger.info('log-info initilaized');
    logger.error('error log initilaized');
    logger.debug("Logging initialized at debug level");
}

export default logger;
