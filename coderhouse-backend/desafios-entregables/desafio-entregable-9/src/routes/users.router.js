import express from "express";
import { logger } from "../logger.js";
import UserDTO from "../dao/DTOs/users.dto.js";
import Users from "../dao/mongo/users.mongo.js";
import { usersServices } from "../repositories/index.js";

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
