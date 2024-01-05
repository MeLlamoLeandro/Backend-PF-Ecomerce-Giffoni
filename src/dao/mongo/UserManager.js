//Desde que uso Passport, este modulo no se usa mas. Lo dejo por las dudas que lo necesite en un futuro.
import { userModel } from "../models/user.model.js";

class UserMongo {
  addUser = async (user) => {
    try {
      const result = await userModel.create(user);
      return result;
    } catch (error) {
      throw error;
    }
  };

  async login(email, password) {
    try {
      const user = (await userModel.findOne(email, password).lean()) || null;
      if (user) {
        console.log("User logged in successfully!");
        return user;
      }
      console.log("Invalid credentials!");
      return false;
    } catch (error) {
      throw error;
    }
  }

  //#aux
  getUsers = async () => {
    try {
      const users = await userModel.find().lean();
      return users;
    } catch (error) {
      console.log(error);
    }
  };
  getUserByEmail = async (email) => {
    try {
      const result = await userModel.findOne({ email: email }).lean();
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  updatePassword = async (email, password) => {
    try {
      const result = await userModel.findOneAndUpdate(
        { email: email },
        { password: password },
        { new: true }
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  updateRole = async (email, role) => {
    try {
      const result = await userModel.findOneAndUpdate(
        { email: email },
        { role: role },
        { new: true }
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  updateLastConnection = async (email, last_connection) => {
    try {
      const result = await userModel.findOneAndUpdate(
        { email: email },
        { last_connection: last_connection },
        { new: true }
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  updateDocuments = async (email, document) => {
    try {
      const result = await userModel.updateOne({ email }, { $set: document });
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  deleteUser = async (email) => {
    try {
      const result = await userModel.findOneAndDelete({ email: email });
      return result;
    } catch (error) {
      console.log(error);
    }
  };
}

export default UserMongo;
