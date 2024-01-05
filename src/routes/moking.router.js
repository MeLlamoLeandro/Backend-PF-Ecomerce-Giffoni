import { Router } from "express";
import { mokingProductsController } from "../controllers/moking.controller.js";
import { passportCall } from "../utils/passport.js";
import { authorization } from "../middlewares/roleAuth.js";

const router = Router();

router.get("/mockingproducts", passportCall('jwt'), authorization(['user','premium','admin']), mokingProductsController);

export { router as mokingRouter };
