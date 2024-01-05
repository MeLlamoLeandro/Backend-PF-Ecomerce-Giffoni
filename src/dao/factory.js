import mongoose from "mongoose";
import config from "../config/config.js";

export let Carts;
export let Messages;
export let Products;
export let Users;
export let Tickets;
switch (config.persistence) {
  //#MongoDB
  case "MONGO":
    const dbUrl = config.mongoURL;
    const connection = mongoose
      .connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("MongoDB connected"))
      .catch((err) => console.log("MongoDB connection error:", err));

    const { default: CartsMongo } = await import("./mongo/CartManager.js");
    const { default: MessagesMongo } = await import("./mongo/ChatManager.js");
    const { default: ProductsMongo } = await import(
      "./mongo/ProductManager.js"
    );
    const { default: UsersMongo } = await import("./mongo/UserManager.js");
    const { default: TicketsMongo } = await import("./mongo/TicketManager.js");
    Carts = CartsMongo;
    Messages = MessagesMongo;
    Products = ProductsMongo;
    Users = UsersMongo;
    Tickets = TicketsMongo;

    break;
  case "FILES":
    const { default: CartsFiles } = await import("./files/CartManagerFS.js");
    const { default: ProductsFiles } = await import("./files/ProductManagerFS.js");
    Carts = CartsFiles;
    Products = ProductsFiles;
    break;
  default:
    console.log("No persistence selected");
    break;
}
