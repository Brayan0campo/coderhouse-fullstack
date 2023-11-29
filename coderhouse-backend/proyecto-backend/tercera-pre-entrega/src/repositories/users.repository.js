import UserDTO from "../dao/dtos/users.dto";

export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAllUsers() {
    const users = await this.dao.getAllUsers();
    return users;
  }

  async getUserById(id) {
    const user = await this.dao.getUserById(id);
    return user;
  }

  async getUserByEmail(email) {
    const user = await this.dao.getUserByEmail(email);
    return user;
  }

  async createUser(user) {
    const userDTO = new UserDTO(user);
    const newUser = await this.dao.createUser(userDTO);
    return newUser;
  }

  async updateUser(id, user) {
    const userDTO = new UserDTO(user);
    const updatedUser = await this.dao.updateUser(id, userDTO);
    return updatedUser;
  }

  async deleteUser(id) {
    const deletedUser = await this.dao.deleteUser(id);
    return deletedUser;
  }
}
