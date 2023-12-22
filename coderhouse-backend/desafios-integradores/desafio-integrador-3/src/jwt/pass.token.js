import Jwt from "jsonwebtoken";

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
  return oldPassword !== newPassword;
}
