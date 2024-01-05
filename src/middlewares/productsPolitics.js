import { productsService } from "../services/index.js";
//verifica si el que esta comprando/modificando/eliminando es el dueño del producto
export const productsPolitics = async (req, res, next) => {

    //si el role es admin, puede hacer lo que quiera. si es premium solo puede modificar/eliminar sus productos
    if (req.user.role == "admin") {
        return next();
    }

    const { pid } = req.params;
    const user = req.user;
    try {
        const product = await productsService.getProductById(pid);
        if (product.owner != user.email) {
            return res.status(401).send({
                status: "error",
                message: "You are not the owner of this product",
            });
        }
        next();
    }
    catch (error) {
        return next(error);
    }
}