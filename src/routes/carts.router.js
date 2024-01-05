import { Router } from "express";
import {
  addCartController,
  getCartByIdController,
  addProductToCartController,
  deleteProductFromCartController,
  deleteCartController,
  updateCartController,
  updateProductFromCartController,
  purchaseCartController,
} from "../controllers/carts.controller.js";
import { passportCall } from "../utils/passport.js";
import {authorization} from "../middlewares/roleAuth.js";
import { cartsPolitics } from "../middlewares/cartPolitics.js";

const router = Router();

//Solamente enviando POST a la raiz debe crear un carrito vacio
router.post("/", passportCall("jwt"), authorization(['user','premium']), addCartController);

// get Cart por cid
router.get("/:cid", passportCall("jwt"), authorization(['user','premium']), getCartByIdController);

router.put("/:cid", passportCall("jwt"), authorization(['user','premium']), updateCartController);

router.delete("/:cid", passportCall("jwt"), authorization(['user','premium']), deleteCartController);

//agrega productos al carrito seleccionado
router.post("/:cid/products/:pid", passportCall("jwt"), authorization(['user','premium']), cartsPolitics, addProductToCartController); 

router.put("/:cid/products/:pid", passportCall("jwt"), authorization(['user','premium']), updateProductFromCartController);

router.delete("/:cid/products/:pid", passportCall("jwt"), authorization(['user','premium']), deleteProductFromCartController);

router.post("/:cid/purchase", passportCall("jwt"), authorization(['user','premium']), purchaseCartController);

export { router as cartsRouter };
