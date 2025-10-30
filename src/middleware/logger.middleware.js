const morgan = require("morgan");
const logger = require("../utils/logger");
const config = require("../config");

// Create custom token for user email
morgan.token("user", (req) => req.user?.email || "anonymous");

// Create custom token for response time in ms
morgan.token("response-time-ms", (req, res) => {
  if (!req._startAt || !res._startAt) {
    return "";
  }

  const ms =
    (res._startAt[0] - req._startAt[0]) * 1e3 +
    (res._startAt[1] - req._startAt[1]) * 1e-6;

  return ms.toFixed(3);
});

// Define log format
const logFormat =
  ":method :url :status :response-time-ms ms - :user - :remote-addr";

// Create morgan middleware
const loggerMiddleware = morgan(logFormat, {
  stream: logger.stream,
  skip: (req) =>
    // Skip logging for health check in production
    config.env === "production" && req.path === "/health",
});

module.exports = loggerMiddleware;
