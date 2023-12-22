import express from "express";
import { logger } from "../logger.js";
import { transporter } from "../utils.js";
import UserDTO from "../dao/DTOs/users.dto.js";
import Users from "../dao/mongo/users.mongo.js";
import { usersServices } from "../repositories/index.js";
import { generateResetToken, validatePassword } from "../jwt/pass.token.js";

const usersMongo = new Users();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await usersMongo.get();
    logger.info("Users retrieved successfully");
    res.send({ status: "success", payload: users });
  } catch (error) {
    logger.error("Error retrieving users");
    res.send({ status: "error", payload: error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await usersMongo.getById(id);
    logger.info("User retrieved successfully");
    res.send({ status: "success", payload: user });
  } catch (error) {
    logger.error("Error retrieving user");
    res.send({ status: "error", payload: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, age, role, password } = req.body;
    const user = new UserDTO(firstName, lastName, email, age, role, password);
    const createdUser = await usersServices.createUser(user);
    logger.info("User created successfully");
    res.send({ status: "success", payload: createdUser });
  } catch (error) {
    logger.error("Error creating user");
    res.send({ status: "error", payload: error });
  }
});

router.post("/password/reset-request", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await usersMongo.findByEmail({ email });
    if (!user) {
      logger.error("User not found");
      return res.status(404).send({ message: "User not found." });
    }

    const resetToken = generateResetToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;

    await user.save();

    const resetUrl = `http://localhost:8080/reset-password/${resetToken}`;
    const message = `Click the following link to reset your password: ${resetUrl}`;

    await transporter.sendMail({
      from: "ocamporodriguezbrayan@gmail.com",
      to: email,
      subject: "Password reset request",
      text: message,
    });

    logger.info("Password reset request sent successfully");
    res.send({
      status: "success",
      payload: "Password reset request sent successfully",
    });
  } catch (error) {
    logger.error("Error sending password reset request");
    res.send({ status: "error", payload: error });
  }
});

router.post("/password/reset/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await usersMongo.findByResetToken(token);

    if (!user || user.resetPasswordExpires < Date.now()) {
      logger.error("Invalid or expired reset token");
      return res
        .status(400)
        .send({ message: "Invalid or expired reset token." });
    }

    if (validatePassword(user.password, newPassword)) {
      logger.error("New password cannot be the same as the old password");
      return res.status(400).send({
        message: "New password cannot be the same as the old password.",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    logger.info("Password reset successfully");
    res.send({ message: "Password reset successfully." });
  } catch (error) {
    logger.error("Error resetting password");
    res.status(500).send({ message: "Internal server error." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, age, role, password } = req.body;
    const user = new UserDTO(firstName, lastName, email, age, role, password);
    const updatedUser = await usersServices.updateUser(id, user);
    logger.info("User updated successfully");
    res.send({ status: "success", payload: updatedUser });
  } catch (error) {
    logger.error("Error updating user");
    res.send({ status: "error", payload: error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await usersServices.deleteUser(id);
    logger.info("User deleted successfully");
    res.send({ status: "success", payload: deletedUser });
  } catch (error) {
    logger.error("Error deleting user");
    res.send({ status: "error", payload: error });
  }
});

export default router;
