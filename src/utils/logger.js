import winston from "winston";
import { environmentMode } from "../config/config.js";

const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "bold red",
    error: "red",
    warning: "italic yellow",
    info: "bold blue",
    http: "green",
    debug: "white",
  },
};

const devLogger = winston.createLogger({
  //personalizo los niveles segun el entorno
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.simple()
      ),
      // format: winston.format.combine(winston.format.colorize({ all:true }), winston.format.simple() ),
    }),
  ],
});

const prodLogger = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.simple()
      ),
      // format: winston.format.combine(winston.format.colorize({ all:true }), winston.format.simple() ),
    }),
    new winston.transports.File({
      filename: "./logs/errors.log",
      level: "error",
      format: winston.format.simple(),
    }),
  ],
});

export function addLogger(req, res, next) {
  if (environmentMode == "dev") {
    req.logger = devLogger;
  } else if (environmentMode == "prod") {
    req.logger = prodLogger;
  }
  
  req.logger.http(
    `${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
}
