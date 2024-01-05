import passport from "passport";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import UserDTOCurrent from "../dao/DTOs/user.dto.current.js";
import { usersService } from "../services/index.js";

const userAdmin = {
  email: config.adminEmail,
  password: config.adminPassword,
};
const PRIVATE_KEY = config.JWTPrivateKey;

export const passportLoginController = passport.authenticate("login", {
  session: false,
  failureRedirect: "/api/sessions/faillogin",
});

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  req.logger.info(`${email} logged in`);

  //actualizo la fecha de ultima conexion
  let last_connection = new Date();
  await usersService.updateLastConnection(email, last_connection);

  const serializedUser = {
    id: req.user._id,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    cart: req.user.cart,
    role: req.user.role,
    avatar: req.user.avatar,
    last_connection: req.user.last_connection,
    age: req.user.age,
    documents: req.user.documents,
    status: req.user.status,
  };

  let user = await usersService.getUserByEmail(email);

  if (!user)
    return res
      .status(401)
      .send({ status: "Error", message: "Invalid credentials" });

  let token = jwt.sign(serializedUser, PRIVATE_KEY, { expiresIn: "1h" });

  res
    .cookie("coderCookieToken", token, { maxAge: 3600 * 1000, httpOnly: true })
    .send({ status: "success", payload: serializedUser }); //envio el token en la cookie para que el cliente lo guarde
};


export const failLoginController = async (req, res) => {
  res.status(401).send({ status: "Error", message: "Invalid credentials" });
};

export const redirectLoginController = async (req, res) => {
  res.send({ status: "success", message: "User registered successfully" });
  /*  res.redirect("/login"); */
};

export const logoutController = async (req, res, next) => {
  try {
    if (req.session) {
      req.session.destroy();
      res.clearCookie("coderCookieToken");
      res.redirect("/login");
    }
    if (!req.user) {
      res.redirect("/login");
    }

    const updates = { last_connection: new Date() };
    await usersService.updateUser(req.user.email, updates);

    res.clearCookie("coderCookieToken");
    res.redirect("/");
  } catch (error) {
    req.logger.error(error.message);
    next(error);
  }
};

export const passportRegisterController = passport.authenticate("register", {
  failureRedirect: "/failregister",
});

export const githubController = passport.authenticate("github", {
  scope: ["user:email"],
});

export const githubCallbackController = passport.authenticate("github", {
  failureRedirect: "/failLogin",
});

export const githubSuccessController = async (req, res) => {
  const serializedUser = {
    id: req.user._id,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    cart: req.user.cart,
    role: req.user.role,
    avatar: req.user.avatar,
    last_connection: req.user.last_connection,
    age: req.user.age,
    documents: req.user.documents,
    status: req.user.status,
  };

  let token = jwt.sign(serializedUser, PRIVATE_KEY, { expiresIn: "1h" });

  //actualizo la fecha de ultima conexion
  let last_connection = new Date();
  await usersService.updateLastConnection(
    serializedUser.email,
    last_connection
  );

  res.cookie("coderCookieToken", token, {
    maxAge: 3600 * 1000,
    httpOnly: true,
  });

  res.redirect("/products");
};

export const currentControlller = async (req, res) => {
  const user = new UserDTOCurrent(req.user); //invoco al DTO para no mostrar el password el password
  res.send({ status: "sucess", payload: user });
};
