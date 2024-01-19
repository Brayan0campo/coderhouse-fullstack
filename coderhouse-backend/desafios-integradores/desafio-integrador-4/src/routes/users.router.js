import express from "express";
import { logger } from "../logger.js";
import UserDTO from "../dao/DTOs/users.dto.js";
import Users from "../dao/mongo/users.mongo.js";
import { transporter, upload } from "../utils.js";
import { usersServices } from "../repositories/index.js";
import { generateResetToken, validatePassword } from "../jwt/pass.token.js";

const usersMongo = new Users();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await usersMongo.get();
    logger.info("Users retrieved successfully");
    res.json({ status: "success", payload: users });
  } catch (error) {
    logger.error("Error retrieving users", error);
    res
      .status(500)
      .json({ status: "error", payload: "Error retrieving users" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await usersMongo.getById(id);

    if (!user) {
      logger.info("User not found");
      res.status(404).send({ error: "User not found" });
      return;
    }

    logger.info("User retrieved successfully");
    res.status(200).send({ status: "success", payload: user });
  } catch (error) {
    logger.error("Error retrieving user", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, age, role, password } = req.body;
    const user = new UserDTO(firstName, lastName, email, age, role, password);
    const createdUser = await usersServices.createUser(user);
    logger.info("User created successfully");
    res.status(201).send({ status: "success", payload: createdUser });
  } catch (error) {
    logger.error("Error creating user", error);
    res.status(500).send({ status: "error", payload: error.message });
  }
});

const roles = ["admin", "user", "premium"];
router.post("/premium/:uid", async (req, res) => {
  try {
    const { role } = req.body;
    const { uid } = req.params;

    if (!roles.includes(role)) {
      logger.error("Invalid role provided");
      return res.status(400).send({ message: "Invalid role provided." });
    }

    if (!(await requiredDocument(uid))) {
      logger.error(
        "The user does not have the required documents for the premium role."
      );
      return res.status(404).send({
        message: "The user does not have the required documents.",
      });
    }

    const changeUserRole = await usersServices.updateUserRole(uid, role);

    if (changeUserRole) {
      logger.info("User role updated successfully");
      res.status(200).json({ message: "User role updated successfully" });
    } else {
      logger.error("Error updating user role");
      res.status(500).json({ message: "Error updating user role" });
    }
  } catch (error) {
    logger.error("Error updating user role");
    res.status(500).send({ status: "error", payload: error });
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

router.post(
  "/:uid/documents",
  upload.fields([
    { name: "profiles", maxCount: 3 },
    { name: "products", maxCount: 3 },
    { name: "documents", maxCount: 3 },
    { name: "identifications", maxCount: 1 },
    { name: "proof_of_address", maxCount: 1 },
    { name: "proof_of_account_statement", maxCount: 1 },
  ]),
  async (req, res) => {
    const files = req.files;
    const { uid } = req.params;

    try {
      const user = await usersMongo.getById(uid);
      if (!user) {
        throw new Error("User not found");
      }

      const allFiles = [];

      Object.entries(files).forEach(([type, fileList]) => {
        if (fileList) {
          const formattedFiles = fileList.map((file) => ({
            name: type,
            path: file.path,
          }));
          usersMongo.updateDocuments(uid, ...formattedFiles);
          allFiles.push(...formattedFiles);
        }
      });

      logger.info("Documents uploaded successfully");
      res.send({
        status: "success",
        payload: allFiles,
        message: "Documents uploaded successfully",
      });
    } catch (error) {
      logger.error(error.message);
      res.status(error.status || 500).send({ message: error.message });
    }
  }
);

export default router;
