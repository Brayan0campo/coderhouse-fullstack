import { usersModel } from "./models/users.model.js";

export default class UsersMongo {
  constructor() {}

  get = async () => {
    try {
      const users = await usersModel.find();
      return users;
    } catch (error) {
      console.error("Error getting users: ", error);
      return "Error getting users";
    }
  };

  getById = async (id) => {
    try {
      const user = await usersModel.findById(id);
      return user;
    } catch (error) {
      console.error("Error getting user: ", error);
      return "Error getting user";
    }
  };

  findByEmail = async (param) => {
    try {
      const user = await usersModel.findOne(param);
      return user;
    } catch (error) {
      console.error("Error finding user: ", error);
      return "Error finding user";
    }
  };

  findByJWT = async (filter) => {
    try {
      const user = await usersModel.find(filter);
      return user;
    } catch (error) {
      console.error("Error finding user: ", error);
      return "Error finding user";
    }
  };

  createUser = async (newUser) => {
    try {
      const user = await usersModel.create(newUser);
      return user;
    } catch (error) {
      console.error("Error creating user: ", error);
      return "Error creating user";
    }
  };

  updateUser = async (id, user) => {
    try {
      const updatedUser = await usersModel.findByIdAndUpdate(id, user, {
        new: true,
      });
      return updatedUser;
    } catch (error) {
      console.error("Error updating user: ", error);
      return "Error updating user";
    }
  };

  deleteUser = async (id) => {
    try {
      const deletedUser = await usersModel.findByIdAndDelete(id);
      return deletedUser;
    } catch (error) {
      console.error("Error deleting user: ", error);
      return "Error deleting user";
    }
  };
}
