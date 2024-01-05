import bcrypt from "bcrypt";

//#bycrypt
export const createHash = async (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10)); // encripta la contraseña
export const isValidPassword = async (user, password) =>
  bcrypt.compareSync(password, user.password); // compara la contraseña encriptada con la contraseña ingresada
