import userModel from "../models/users.model.js";

export default class User {
  getUsers = async () => {
    try {
      let users = await userModel.find();
      return users;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getUserById = async (id) => {
    try {
      let user = await userModel.findOne({ _id: id });
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  createUser = async (user) => {
    try {
      let result = await userModel.create(user);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  updateUser = async (id, user) => {
    try {
      let result = await userModel.updateOne({ _id: id }, { $set: user });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  deleteUserById = async (id) => {
    try {
      let result = await userModel.deleteOne({ _id: id });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}