import jwt from "jsonwebtoken";

export function signToken(res, email, password) {
  const token = jwt.sign({ email, password, role: "user" }, "SecretKey", {
    expiresIn: "24h",
  });
  res.cookie("cookie", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
  return token;
}
