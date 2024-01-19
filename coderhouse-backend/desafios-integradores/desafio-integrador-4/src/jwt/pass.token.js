import Jwt from "jsonwebtoken";

export function signToken(res, email, password) {
  const token = Jwt.sign({ email, password, role: "user" }, "SecretKey", {
    expiresIn: "24h",
  });
  res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
  return token;
}

export function emailTokenLogin(token) {
  try {
    const decoded = Jwt.verify(token, "SecretKey");
    return decoded;
  } catch (error) {
    console.error("Error verifying token", error);
    return null;
  }
}

export function generateResetToken(userId) {
  const resetToken = Jwt.sign({ userId }, "SecretKey", {
    expiresIn: "1h",
  });
  return resetToken;
}

export function verifyResetToken(resetToken) {
  try {
    const decodedToken = Jwt.verify(resetToken, secretKey);
    return decodedToken.userId;
  } catch (error) {
    return null;
  }
}

export function validatePassword(oldPassword, newPassword) {
  return oldPassword === newPassword;
}
