import UserDTO from "../dao/DTOs/user.dto.js";
export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  addUser = async (user) => {
    const newUser = new UserDTO(user);
    const result = await this.dao.addUser(newUser);
    return result;
  };

  getUsers = async () => {
    const AllUsers = await this.dao.getUsers();
    return AllUsers;
  };

  getUserByEmail = async (email) => {
    const user = await this.dao.getUserByEmail(email);
    return user;
  };

  updatePassword = async (email, password) => {
    const result = await this.dao.updatePassword(email, password);
    return result;
  };

  updateRole = async (email, role) => {
    const result = await this.dao.updateRole(email, role);
    return result;
  };

  updateLastConnection = async (email, last_connection) => {
    const result = await this.dao.updateLastConnection(email, last_connection);
    return result;
  };

  updateDocuments = async (email, document) => {
    const result = await this.dao.updateDocuments(email, document);
    return result;
  };

  deleteUser = async (email) => {
    const result = await this.dao.deleteUser(email);
    return result;
  };
}
