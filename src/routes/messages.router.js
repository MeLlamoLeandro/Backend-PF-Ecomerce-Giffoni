import { Router } from "express";
import { passportCall } from "../utils/passport.js";
import { authorization } from "../middlewares/roleAuth.js";

const router = Router();

router.get("/",  passportCall('jwt'), authorization(['user','premium','admin']), (req, res) => {});

router.post("/",  passportCall('jwt'), authorization(['user','premium','admin']), (req, res) => {});

export { router as messagesRouter };
