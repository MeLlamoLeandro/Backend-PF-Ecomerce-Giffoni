import jwt from "jsonwebtoken";
import config from "../config/config.js";
const PRIVATE_KEY = config.JWTPrivateKey;

//jwt para obtener el token con cookies
export const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies["coderCookieToken"];
    }
    return token;
  };

export const generateResetToken = (user) => {
  return jwt.sign(user, PRIVATE_KEY, { expiresIn: '1h' });
};