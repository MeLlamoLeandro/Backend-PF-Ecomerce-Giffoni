import { Router } from "express";
import {
  /* mailController, */
  mailResetController,
} from "../controllers/mail.controller.js";
import { passportCall } from "../utils/passport.js";
/* import { authorization } from "../middlewares/roleAuth.js"; */

const router = Router();

//router.get("/",  passportCall('jwt'), authorization(['user','premium','admin']), mailController);//envia un mail al pegarle desde postman

router.post("/reset", passportCall("jwt"), mailResetController); //envia el mail con token para resetear el password

export { router as mailRouter };
