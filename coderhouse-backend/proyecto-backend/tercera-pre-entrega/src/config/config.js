import dotenv from "dotenv";

dotenv.config();

export default {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  SECRET_KEY: process.env.SECRET_KEY,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  PERSISTENCE: process.env.PERSISTENCE,
};
