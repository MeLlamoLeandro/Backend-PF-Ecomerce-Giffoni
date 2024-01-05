import { Router } from "express";
import { passportCall } from "../utils/passport.js";
import {
  passportLoginController,
  loginController,
  passportRegisterController,
  redirectLoginController,
  failLoginController,
  logoutController,
  githubController,
  githubCallbackController,
  githubSuccessController,
  currentControlller,
} from "../controllers/sessions.controller.js";


const router = Router();

//Estrategia de login
router.post( "/login", passportLoginController, loginController);

router.get("/faillogin", failLoginController);

router.get("/logout", logoutController);

//Estrategia de registro
router.post("/register", passportRegisterController, redirectLoginController);

//Estrategia de Terceros: Github
router.get("/github", githubController, async (req, res) => {});

router.get("/githubcallback", githubCallbackController, githubSuccessController);

//Estrategia JWT current
router.get("/current", passportCall("jwt"), currentControlller);

export { router as sessionsRouter };
