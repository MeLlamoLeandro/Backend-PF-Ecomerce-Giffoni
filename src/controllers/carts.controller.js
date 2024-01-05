import {
  cartsService,
  productsService,
  ticketsService,
} from "../services/index.js";
import {sendEmailFunction} from  "./mail.controller.js"
import { generateHtmlForTicket } from "../utils/ticketHtml.js";

//Create

export const addCartController = async (req, res) => {
  const result = await cartsService.addCart();
  if (result) {
    //paso el id del carrito creado
    res.status(201).send({
      status: "success",
      message: "Cart created successfully!",
      id: result._id,
    });
  } else {
    res.status(500).send({
      status: "error",
      message: "Error! The Cart could not be created",
    });
  }
};

export const addProductToCartController = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const cart = await cartsService.getCartById(cid);
  if (!cart) {
    res
      .status(400)
      .send({ status: "error", message: "The Cart does not exists" });
    return;
  }
  const result = await cartsService.addProductToCart(cid, pid);
  if (result) {
    res.send({
      status: "success",
      message: `Product ${pid} successfully added to Cart ${cid}`,
    });
  } else {
    res.status(500).send({
      status: "error",
      message: `Error! The product could not be added to the Cart ${cid}`,
    });
  }
};

//Read

export const getCartByIdController = async (req, res) => {
  const cid = req.params.cid;
  const cart = await cartsService.getCartById(cid);
  if (!cart) {
    res
      .status(404)
      .send({ status: "error", message: "The Cart does not exists" });
    return;
  }
  res.send({ products: cart.products });
};

//Update

export const updateCartController = async (req, res) => {
  const cid = req.params.cid;
  const cart = await cartsService.getCartById(cid);
  if (!cart) {
    res
      .status(404)
      .send({ status: "error", message: "The Cart does not exists" });
    return;
  }

  const result = await cartsService.updateCart(cid, req.body.products);
  if (result) {
    res.send({
      status: "success",
      message: `Cart ${cid} updated successfully!`,
    });
  } else {
    res.status(500).send({
      status: "error",
      message: `Error! The Cart ${cid} could not be updated`,
    });
  }
};

export const updateProductFromCartController = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const cart = await cartsService.getCartById(cid);
  if (!cart) {
    res
      .status(400)
      .send({ status: "error", message: "The Cart does not exists" });
    return;
  }
  const result = await cartsService.updateProductFromCart(
    cid,
    pid,
    req.body.quantity
  );
  if (result) {
    res.send({
      status: "success",
      message: `Product ${pid} successfully updated in Cart ${cid}`,
    });
  } else {
    res.status(500).send({
      status: "error",
      message: `Error! The product ${pid} could not be updated in the Cart ${cid}`,
    });
  }
};

//Delete

export const deleteProductFromCartController = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const cart = await cartsService.getCartById(cid);
  if (!cart) {
    res
      .status(400)
      .send({ status: "error", message: "The Cart does not exists" });
    return;
  }

  const result = await cartsService.deleteProductFromCart(cid, pid);
  if (result) {
    res.send({
      status: "success",
      message: `Product ${pid} successfully deleted from Cart ${cid}`,
    });
  } else {
    res.status(500).send({
      status: "error",
      message: `Error! The product could not be deleted from the Cart ${cid}`,
    });
  }
};

export const deleteCartController = async (req, res) => {
  const cid = req.params.cid;
  const cart = await cartsService.getCartById(cid);
  if (!cart) {
    res
      .status(400)
      .send({ status: "error", message: "The Cart does not exists" });
    return;
  }
  const result = await cartsService.deleteCart(cid);
  if (result) {
    res.send({
      status: "success",
      message: `Cart ${cid} deleted successfully`,
    });
  } else {
    res.status(500).send({
      status: "error",
      message: `Error! The Cart ${cid} could not be deleted`,
    });
  }
};


// desarrollar la ultima funcion
export const purchaseCartController = async (req, res) => {
  const cid = req.params.cid;
  const { email } = req.body;

  try {
    const cart = await cartsService.getCartById(cid);

    let cartProducts = cart.products;
    let orderProducts = [];

    cartProducts.forEach((product) => {
      const stock = product.product.stock;

      if (stock > 0) {
        if (product.quantity <= stock) {
          orderProducts.push(product);
          cartProducts = cartProducts.filter((p) => p !== product);
          productsService.updateProduct(product.product._id, {
            stock: stock - product.quantity,
          });
        } else {
          const difference = product.quantity - stock;
          product.quantity = difference;
          orderProducts.push({ product: product.product, quantity: stock });
          productsService.updateProduct(product.product._id, { stock: 0 });
        }
      }
    });

    if (orderProducts.length === 0) {
      throw new Error(`stock not available`);
    }

    
    let subtotal = 0;

    orderProducts.forEach((product) => {
      subtotal += product.quantity * product.product.price;
    });

    const total = subtotal;

    const ticket = await ticketsService.createTicket({
      total,
      products: orderProducts,
      email,
    });

    const order = { ticket, cart: cart };
    const ticketHtml = await generateHtmlForTicket(ticket);
    //mando por email el ticket
    const dataEmail = {
      email: email,
      subject: "ECOMMERCE - CODER BACKEND - PURCHASE",
      message: ticketHtml,
      attachments: [],
    };
    sendEmailFunction(
      dataEmail.email,
      dataEmail.subject,
      dataEmail.message,
      dataEmail.attachments
    );

    res.send({ status: "success", payload: order });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};
