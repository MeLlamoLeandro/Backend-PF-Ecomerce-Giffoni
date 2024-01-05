import { Router } from "express";
import { passportCall } from "../utils/passport.js";
import { authorization } from "../middlewares/roleAuth.js";
import {
  renderHomeController,
  renderRealTimeProductsController,
  renderChatController,
  renderProductsController,
  renderProductDetail,
  renderCartController,
  renderLoginController,
  renderRegisterController,
  renderProfileController,
  renderPwforgetController,
  renderUserManagerController
} from "../controllers/views.controller.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = Router();

//Navigation
router.get("/", renderHomeController);

//si no esta logueado, no puede acceder a estos links y lo redirige a login
router.get("/products",  passportCall("jwt"), isAuth, renderProductsController);
router.get("/profile",  passportCall("jwt") , isAuth, renderProfileController);
router.get("/chat",  passportCall("jwt"), isAuth, authorization(["user","premium"]),  renderChatController);
router.get("/realtimeproducts",  passportCall("jwt"), isAuth, authorization(["admin","premium"]), renderRealTimeProductsController);
router.get("/usermanager",passportCall("jwt"), isAuth, authorization(["admin"]), renderUserManagerController)

//carts & products details
router.get("/products/:pid",  passportCall("jwt"), isAuth,renderProductDetail);
router.get("/carts/:cid",  passportCall("jwt"), isAuth, renderCartController);

//Auth
router.get("/login", renderLoginController);
router.get("/register", renderRegisterController);
router.get("/pwforget", renderPwforgetController);

export default router;
