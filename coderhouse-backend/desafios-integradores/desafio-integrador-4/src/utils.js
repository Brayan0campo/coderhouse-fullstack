import fs from "fs";
import path from "path";
import multer from "multer";
import passport from "passport";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";
import config from "./config/config.js";

export const passportAuth = (strategy) => async (req, res, next) => {
  try {
    const user = await new Promise((resolve, reject) =>
      passport.authenticate(strategy, (err, user, info) => {
        if (err) return reject(err);
        resolve(user);
      })(req, res, next)
    );

    if (!user) {
      return res.status(401).send({ error: info.messages || info.toString() });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const roleAuth = (role) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (!user || user.role !== role) {
        return res.status(401).json({
          error: `Unauthorized or insufficient permissions for role: ${role}`,
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

const fileTypesToDir = {
  profiles: "profiles",
  products: "products",
  documents: "documents",
  identifications: "documents",
  proof_of_address: "documents",
  proof_of_account_statement: "documents",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fileType = file.fieldname;
    const dirFiles = fileTypesToDir[fileType] || "others";
    const createPath = path.join("public", "files", dirFiles);

    if (!fs.existsSync(createPath)) {
      fs.mkdirSync(createPath, { recursive: true });
    }

    cb(null, createPath);
  },
  filename: (req, file, cb) => {
    const fileName = file.fieldname;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const finalFileName = `${fileName}-${uniqueSuffix}${fileExtension}`;
    cb(null, finalFileName);
  },
});

export const upload = multer({ storage: storage });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default __dirname;
