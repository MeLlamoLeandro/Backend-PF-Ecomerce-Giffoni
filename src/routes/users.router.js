import { Router } from "express";
import { passportCall } from "../utils/passport.js";
import {authorization} from "../middlewares/roleAuth.js";
import {
  userPremiumController,
  resetControllerToken,
  updatePWController,
  userDocumentController,
  userController,
  deleteAllUsersController,
  deleteUserController,
  updateRoleController
} from "../controllers/users.controller.js";
import { uploader } from "../utils/multer.js";


const router = Router();

router.get("/", passportCall('jwt'), authorization(['user','premium','admin']), userController);

router.delete("/", passportCall('jwt'), authorization(["admin"]), deleteAllUsersController);//limpia todos los usuarios que no se conectaron en las ultimas 48hs

router.delete("/:uid", passportCall('jwt'), authorization(["admin"]), deleteUserController);//elimina un usuario por id

router.put("/:uid", passportCall('jwt'), authorization(["admin"]), updateRoleController);

router.get("/premium/:uid", passportCall('jwt'), authorization(['user','premium','admin']), userPremiumController);

router.post("/:uid/documents", passportCall('jwt'), authorization(['user','premium','admin']), uploader.array('files'), userDocumentController); //example http://localhost:8080/api/users/JhonDoe@mail.com/documents

router.get("/reset/:token", resetControllerToken); //recibe el token y lo valida

router.post("/updatePW", updatePWController); //actualiza el password

export { router as usersRouter };
