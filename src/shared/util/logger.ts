import winston from "winston";

const {  format} = require('winston');
const options: winston.LoggerOptions = 
    {
        format: format.combine(
          format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
          }),
          format.json(),
          format.prettyPrint()
        ),
        transports: [
            new winston.transports.Console({
                level: process.env.NODE_ENV === "production" ? "error" : "debug",
            format: format.combine(
              format.colorize(),
              format.printf(
                info => `${info.timestamp} ${info.level}: ${info.message}`
              )
            )
          }),
          new winston.transports.File({ filename: "log-info.log", level: "info" }),
          new winston.transports.File({ filename: "debug.log", level: "debug" }),
          new winston.transports.File({ filename: "error.log", level: "error" })
        ]
      };

const logger = winston.createLogger(options);



if (process.env.NODE_ENV !== "production") {
    logger.info(`log-info initilaized`);
    logger.error(`error log initilaized`);
    logger.debug(`Logging initialized at debug level`);
}

export default logger;
