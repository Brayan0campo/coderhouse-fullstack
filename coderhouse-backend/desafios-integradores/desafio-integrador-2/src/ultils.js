import path from "path";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";

export const hashPassword = async (password) => {
  const salt = 10;
  return await bcrypt.hash(password, salt);
};

export const validatePassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default __dirname;
