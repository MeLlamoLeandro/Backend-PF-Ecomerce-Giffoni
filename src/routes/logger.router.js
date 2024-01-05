import { Router } from "express";
import LoggerController from "../controllers/logger.controller.js";
import { passportCall } from "../utils/passport.js";
import { authorization } from "../middlewares/roleAuth.js";

const router = Router();
const loggerController = new LoggerController();

router.get("/", passportCall('jwt'), authorization(['user','premium','admin']), loggerController.loggerTest);

export { router as loggerRouter };
