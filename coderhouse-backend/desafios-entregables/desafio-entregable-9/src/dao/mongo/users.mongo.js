import { usersModel } from "./models/users.model.js";
import { errorMessagesUsers } from "../../services/custom-errors/errors.dictionary.js";

export default class UsersMongo {
  constructor() {}

  get = async () => {
    try {
      const users = await usersModel.find();
      return users;
    } catch (error) {
      console.error("Error getting users: ", error);
      return errorMessagesUsers.errorGettingUsers;
    }
  };

  getById = async (id) => {
    try {
      const user = await usersModel.findById(id);
      return user;
    } catch (error) {
      console.error("Error getting user: ", error);
      return errorMessagesUsers.errorGettingUser;
    }
  };

  findByEmail = async (param) => {
    try {
      const user = await usersModel.findOne(param);
      return user;
    } catch (error) {
      console.error("Error finding user: ", error);
      return errorMessagesUsers.errorGettingUserByEmail;
    }
  };

  findByJWT = async (filter) => {
    try {
      const user = await usersModel.find(filter);
      return user;
    } catch (error) {
      console.error("Error finding user: ", error);
      return errorMessagesUsers.errorGettingUserByJWT;
    }
  };

  createUser = async (newUser) => {
    try {
      const user = await usersModel.create(newUser);
      return user;
    } catch (error) {
      console.error("Error creating user: ", error);
      return errorMessagesUsers.errorCreatingUser;
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
      return errorMessagesUsers.errorUpdatingUser;
    }
  };

  deleteUser = async (id) => {
    try {
      const deletedUser = await usersModel.findByIdAndDelete(id);
      return deletedUser;
    } catch (error) {
      console.error("Error deleting user: ", error);
      return errorMessagesUsers.errorDeletingUser;
    }
  };
}
