import usersModel from "./models/users.model.js";

export default class UsersMongo {
  constructor() {}

  get = async () => {
    try {
      const users = await usersModel.find();
      return users;
    } catch (err) {
      console.log(err);
    }
  };

  getById = async (id) => {
    try {
      const user = await usersModel.findById(id);
      return user;
    } catch (err) {
      console.log(err);
    }
  };

  createUser = async (newUser) => {
    try {
      const User = await usersModel.create(newUser);
      return User;
    } catch (err) {
      console.log(err);
    }
  };

  updateUser = async (id, user) => {
    try {
      const updatedUser = await usersModel.findByIdAndUpdate(id, user, {
        new: true,
      });
      return updatedUser;
    } catch (err) {
      console.log(err);
    }
  };

  deleteUser = async (id) => {
    try {
      const deletedUser = await usersModel.findByIdAndDelete(id);
      return deletedUser;
    } catch (err) {
      console.log(err);
    }
  };
}
