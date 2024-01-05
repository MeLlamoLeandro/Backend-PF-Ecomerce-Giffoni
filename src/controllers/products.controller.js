import { productsService } from "../services/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateProductErrorInfoMissing } from "../services/errors/info.js";
import { sendEmailFunction } from "./mail.controller.js";

export const getProductsController = async (req, res) => {
  const params = req.query;
  let products = await productsService.getAll(params);
  res.send({ products });
};

export const getProductByIdController = async (req, res) => {
  const id = req.params.pid;
  const result = await productsService.getProductById(id);
  //console.log(result);
  req.logger.info(result, "Product found");
  res.send({ Product: result });
};

export const addProductController = async (req, res, next) => {
  // el error esta en tratar con un objeto product y meter adentro otro objeto
  let { product } = req.body;
  const user = req.user;

  try {
    if (user.role != "admin") {
      product.owner = user.email;
    }

    if (!product.title) {
      const error = CustomError.createError({
        name: "Add product error",
        cause: "Error trying to add a product",
        // cause: "Error trying to add a product",
        message: "Product is missing",
        code: EErrors.MISSING_INFO_ERROR,
      });
    }

    //agrego el producto
    const result = await productsService.addProduct(product);
    res.send({ status: "success", payload: result });
  } catch (error) {
    return next(error);
  }
};

export const updateProductController = async (req, res) => {
  const id = req.params.pid;
  const product = req.body.product;
  //actualizo el producto
  const result = await productsService.updateProduct(id, product);
  if (result) {
    res.send({ status: "success", message: "Product updated successfully" });
  } else {
    res.status(500).send({
      status: "error",
      message: "Error! Product could not be updated!",
    });
  }
};

export const deleteProductController = async (req, res) => {
  //si el owner del producto no es admin entonces notifico al dueño por mail luego de eliminar el producto
  const id = req.params.pid;
  const productOwner = await productsService.getProductOwner(id);
  const result = await productsService.deleteProduct(id);

  if (result) {
    if (productOwner != "admin") {
      //envio mail al dueño del producto
      console.log("enviando mail a: " + productOwner);
      const dataEmail = {
        email: productOwner,
        subject: "Product deleted",
        message: `Dear ${productOwner}: Your product ID ${id} has been deleted from mongo database.`,
        attachments: [],
      };
      sendEmailFunction(
        dataEmail.email,
        dataEmail.subject,
        dataEmail.message,
        dataEmail.attachments
      );
    }
    res.send({ status: "success", message: "Product deleted successfully" });
  } else {
    res.status(500).send({
      status: "error",
      message: "Error! Product could not be deleted!",
    });
  }
};
