import { logger } from "./logger.js";

export const middleware = function (req, res, next) {
  req.logger = logger;
  next();
};
