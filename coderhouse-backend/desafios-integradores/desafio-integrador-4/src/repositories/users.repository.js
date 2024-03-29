export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  get = async () => {
    try {
      const users = await this.dao.get();
      return users;
    } catch (error) {
      console.error("Error getting users: ", error);
      return "Error getting users";
    }
  };

  getUser = async (id) => {
    try {
      const user = await this.dao.getUser(id);
      if (!user) {
        return { error: "User not found" };
      }
      return user;
    } catch (error) {
      console.error("Error getting user: ", error);
      return "Error getting user";
    }
  };

  getUserRole = async (email) => {
    try {
      const user = await this.dao.getUserRole(email);
      if (!user) {
        return { error: "User not found" };
      }
      return user;
    } catch (error) {
      console.error("Error getting user: ", error);
      return "Error getting user";
    }
  };

  createUser = async (newUser) => {
    try {
      const createdUser = await this.dao.createUser(newUser);
      return createdUser;
    } catch (error) {
      console.error("Error creating user: ", error);
      return "Error creating user";
    }
  };

  updateUser = async (id, user) => {
    try {
      const updatedUser = await this.dao.updateUser(id, user);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user: ", error);
      return "Error updating user";
    }
  };

  updateUserRole = async ({ id, role }) => {
    try {
      const updatedUser = await this.dao.updateUserRole({ id, role });
      return updatedUser;
    } catch (error) {
      console.error("Error updating user role: ", error);
      return "Error updating user role";
    }
  };

  deleteUser = async (id) => {
    try {
      const deletedUser = await this.dao.deleteUser(id);
      return deletedUser;
    } catch (error) {
      console.error("Error deleting user: ", error);
      return "Error deleting user";
    }
  };
}
