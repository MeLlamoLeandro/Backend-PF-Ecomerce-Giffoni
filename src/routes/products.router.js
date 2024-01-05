import { Router } from "express";
import {
  getProductsController,
  getProductByIdController,
  addProductController,
  updateProductController,
  deleteProductController,
} from "../controllers/products.controller.js";
import { passportCall } from "../utils/passport.js"; 
import{authorization} from "../middlewares/roleAuth.js";
import { productsPolitics } from "../middlewares/productsPolitics.js";

const router = Router();
//creo el endpoint /products y /products?limit=n?page=n?query=category:Papelería?sort=asc
router.get("/", passportCall('jwt'), authorization(["user","premium","admin"]), getProductsController);

//creo el endpoint /products/id como parametro
router.get("/:pid", passportCall('jwt'), authorization(["user","premium","admin"]), getProductByIdController);

//creo el endpoint POST raiz
router.post("/", passportCall('jwt'), authorization(["admin","premium"]), addProductController);

router.put("/:pid", passportCall('jwt'), authorization(["admin","premium"]), updateProductController);

router.delete("/:pid", passportCall('jwt'), authorization(["admin","premium"]), productsPolitics, deleteProductController);

export { router as productsRouter }; //Redefino el router como productsRouter
