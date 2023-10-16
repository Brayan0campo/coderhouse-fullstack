import { usersModel } from "../models/users.model.js";

class UserManager extends usersModel {
  constructor() {
    super();
  }

  async validateUser(param) {
    try {
      const user = await UserManager.findOne({ email: param });
      if (!user) return "User not found";
      return user;
    } catch (error) {
      console.error("Error validating user", error);
      return "Error validating user";
    }
  }

  async getUsers() {
    try {
      const users = await UserManager.find({});
      return users;
    } catch (error) {
      console.error("Error getting users", error);
      return [];
    }
  }

  async getUserById(id) {
    try {
      const user = await UserManager.findById(id).lean();
      if (!user) return "User not found";
      return user;
    } catch (error) {
      console.error("Error getting user", error);
      return "Error getting user";
    }
  }

  async createUser(user) {
    try {
      await usersModel.create(user);
      return "User created";
    } catch (error) {
      console.error("Error creating user", error);
      return "Error creating user";
    }
  }

  async updateUser(id, updatedUser) {
    try {
      const user = await UserManager.findById(id);
      if (!user) return "User not found";
      user.set(updatedUser);
      await user.save();
      return "User updated";
    } catch (error) {
      console.error("Error updating user", error);
      return "Error updating user";
    }
  }

  async deleteUser(id) {
    try {
      const user = await UserManager.findById(id);
      if (!user) return "User not found";
      await user.remove();
      return "User deleted";
    } catch (error) {
      console.error("Error deleting user", error);
      return "Error deleting user";
    }
  }
}

export default UserManager;
