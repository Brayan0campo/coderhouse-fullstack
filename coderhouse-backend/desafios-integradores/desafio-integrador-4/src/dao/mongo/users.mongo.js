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
      const user = await usersModel.findById(id).lean();
      return user;
    } catch (error) {
      console.error("Error getting user: ", error);
      return errorMessagesUsers.errorGettingUser;
    }
  };

  getUserRole = async (email) => {
    try {
      const user = await usersModel.findOne({ email: email });

      if (user && user.role === "premium") {
        return "premium";
      } else {
        return "user not premium";
      }
    } catch (error) {
      console.error("Error getting user role: ", error);
    }
  };

  findByResetToken = async (token) => {
    try {
      const user = await usersModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      return user;
    } catch (error) {
      console.error("Error finding user by reset token: ", error);
      return errorMessagesUsers.errorFindingUserByResetToken;
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

  updateLastConnection = async (email) => {
    try {
      const updatedUser = await usersModel.findOneAndUpdate(
        { email: email },
        { $set: { lastConnection: new Date() } },
        { new: true }
      );

      if (updatedUser) {
        return updatedUser;
      } else {
        console.error("Error updating user last connection: ", error);
        return errorMessagesUsers.errorUpdatingUserLastConnection;
      }
    } catch (error) {
      console.error("Error updating user last connection: ", error);
      return errorMessagesUsers.errorUpdatingUserLastConnection;
    }
  };

  updateDocuments = async (id, document) => {
    try {
      const user = await usersModel.findById(id);

      if (!user) {
        return errorMessagesUsers.errorUpdatingUserDocuments;
      }

      if (!Array.isArray(user.documents)) {
        user.documents = [];
      }

      user.documents.push(...(Array.isArray(document) ? document : [document]));
      const updatedUser = await user.save();
      return updatedUser;
    } catch (error) {
      console.error("Error updating user documents: ", error);
      return errorMessagesUsers.errorUpdatingUserDocuments;
    }
  };

  requiredDocument = async (id) => {
    try {
      const user = await usersModel.findById(id);

      if (!user || !Array.isArray(user.documents)) {
        return false;
      }

      const requiredDocumentsNames = [
        "identifications",
        "proof_of_address",
        "proof_of_account_statement",
      ];

      for (const documentName of requiredDocumentsNames) {
        const document = user.documents.some(
          (doc) => doc.name === documentName
        );

        if (!document) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error getting user: ", error);
      return errorMessagesUsers.errorGettingUser;
    }
  };
}
