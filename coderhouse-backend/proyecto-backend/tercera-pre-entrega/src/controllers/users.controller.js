import User from "../dao/classes/users.dao.js";

const usersService = new User();

export const getUsers = async (req, res) => {
  try {
    let result = await usersService.getUsers();
    res.send({ status: "success", result: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const getUserById = async (req, res) => {
  const { uid } = req.params;
  try {
    let user = await usersService.getUserById(uid);
    res.send({ status: "success", result: user });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const createUser = async (req, res) => {
  const user = req.body;
  try {
    let result = await usersService.createUser(user);
    res.send({ status: "success", result: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { uid } = req.params;
  const user = req.body;
  try {
    let result = await usersService.updateUser(uid, user);
    res.send({ status: "success", result: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const deleteUserById = async (req, res) => {
  const { uid } = req.params;
  try {
    let result = await usersService.deleteUserById(uid);
    res.send({ status: "success", result: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};
