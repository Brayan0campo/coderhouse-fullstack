import path from "path";
import config from "./config/config.js";
import passport from "passport";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";

export const passportAuth = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const roleAuth = (role) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    if (req.user.role != role) {
      return res.status(403).send({ error: "No permissions" });
    }
    next();
  };
};

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default __dirname;
