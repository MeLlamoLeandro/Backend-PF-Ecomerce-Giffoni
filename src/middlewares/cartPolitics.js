import { productsService } from "../services/index.js";

//un usuario premium NO pueda agregar a su carrito un producto que le pertenece
export const cartsPolitics = async (req, res, next) => {
  const {role,email} = req.user;
  const { pid } = req.params;
  if (role === "premium") {
    const {owner} = await productsService.getProductById(pid);
    if (owner === email) {
      return res.status(401).send({
        status: "error",
        message: "You can't add your own product to your cart",
      });
    }
    else{
      next();
    }
  } else {
    next();
  }
};
