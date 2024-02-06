"use strict";
require("dotenv")
const{ format, transports, createLogger, addColors }= require ("winston");
const { combine, timestamp, printf, colorize, errors } = format;

const myFormat = printf(({ level, message, timestamp, stack }) => {
  if (!stack) return `${timestamp} [ ${level} ]: ${message}`;
  else {
    return `${timestamp} [ ${level} ]: ${stack || stack.toString()}`;
  }
});

function logger() {
  if (process.env.NODE_ENV === "development") {
    addColors({
      info: "blue",
      debug: "white",
      warn: "yellow",
      error: "red",
    });
  }
  return createLogger({
    level: "debug",
    format: combine(errors({ stack: true }), colorize(), timestamp(), myFormat),
    transports: [new transports.Console()],
  });
}

 
 module.exports = logger;
 