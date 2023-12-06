import express from "express";
import UserDTO from "../dao/DTOs/users.dto.js";
import Users from "../dao/mongo/users.mongo.js";
import { usersServices } from "../repositories/index.js";

const usersMongo = new Users();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await usersMongo.get();
    res.send({ status: "success", payload: users });
  } catch (error) {
    res.send({ status: "error", payload: error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await usersMongo.getById(id);
    res.send({ status: "success", payload: user });
  } catch (error) {
    res.send({ status: "error", payload: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, age, role, password } = req.body;
    const user = new UserDTO(firstName, lastName, email, age, role, password);
    const createdUser = await usersServices.createUser(user);
    res.send({ status: "success", payload: createdUser });
  } catch (error) {
    res.send({ status: "error", payload: error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, age, role, password } = req.body;
    const user = new UserDTO(firstName, lastName, email, age, role, password);
    const updatedUser = await usersServices.updateUser(id, user);
    res.send({ status: "success", payload: updatedUser });
  } catch (error) {
    res.send({ status: "error", payload: error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await usersServices.deleteUser(id);
    res.send({ status: "success", payload: deletedUser });
  } catch (error) {
    res.send({ status: "error", payload: error });
  }
});

export default router;
