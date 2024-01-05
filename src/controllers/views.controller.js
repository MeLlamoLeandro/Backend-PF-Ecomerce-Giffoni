import UserDTOProfile from "../dao/DTOs/user.dto.profile.js";
import {
  productsService,
  cartsService,
  usersService,
} from "../services/index.js";

export const renderHomeController = async (req, res) => {
  const products = await productsService.getAll(req.query);
  if (!req.user) {
    res.render("home", { products, title: "Home" });
  } else {
    const user = new UserDTOProfile(req.user);
    res.render("home", { products, title: "Home", user: user });
  }
};

export const renderRealTimeProductsController = (req, res) => {
  const user = new UserDTOProfile(req.user);

  res.render("realTimeProducts", {
    title: "Real Time Products",
    user: user,
  });
};

export const renderChatController = (req, res) => {
  const user = new UserDTOProfile(req.user);
  res.render("chat", { title: "Chat", user: user });
};

export const renderProductsController = async (req, res) => {
  const user = new UserDTOProfile(req.user);
  const products = await productsService.getAll(req.query);
  res.render("products", {
    products,
    user: user,
    title: "Products",
  });
};

export const renderProductDetail = async (req, res) => {
  const user = new UserDTOProfile(req.user);
  const pid = req.params.pid;
  const product = await productsService.getProductById(pid);
  res.render("productDetail", { product, user: user });
};

export const renderCartController = async (req, res) => {
  const user = new UserDTOProfile(req.user);
  const cid = req.params.cid;
  const cart = await cartsService.getCartById(cid);

  res.render("cart", { cart, user: user });
};

export const renderLoginController = async (req, res) => {
  res.render("login");
};

export const renderRegisterController = async (req, res) => {
  res.render("register");
};

export const renderPwforgetController = async (req, res) => {
  res.render("pwforget");
};

export const renderProfileController = async (req, res) => {
  const user = new UserDTOProfile(req.user);
  res.render("profile", { user: user });
};

export const renderUserManagerController = async (req, res) => {
  const users = await usersService.getUsers();
  res.render("usermanager", { users: users });
};
