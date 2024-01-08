import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import __dirname from "./utils.js";
import config from "./config/config.js";
import { cartsRouter } from "./routes/carts.router.js";
import { productsRouter } from "./routes/products.router.js";
import { sessionsRouter } from "./routes/sessions.router.js";
import { messagesRouter } from "./routes/messages.router.js";
import viewsRouter from "./routes/views.router.js";
import { mailRouter } from "./routes/mail.router.js";
import { mokingRouter } from "./routes/moking.router.js";
import { loggerRouter } from "./routes/logger.router.js";
import { usersRouter } from "./routes/users.router.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import { productsService, messagesService } from "./services/index.js";
import { Server } from "socket.io";
import errorHandler from "./middlewares/errors/index.js";
import {addLogger} from "./utils/logger.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import { passportCall } from "./utils/passport.js";
import { authorization } from "./middlewares/roleAuth.js";
import { isAuth } from "./middlewares/isAuth.js";

const app = express();
const port = config.port || 8080;

//#Express
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Parsea el body de la request
app.use(express.static(__dirname + "/public"));

//#Passport
//#Session
if (config.persistence === "MONGO") {
  app.use(
    session({
      store: MongoStore.create({ mongoUrl: config.mongoURL, ttl: 3600 }),
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
    })
  );
}

app.use(cookieParser());
initializePassport();
app.use(passport.initialize());
//app.use(passport.session());

//#Error Handler
app.use(errorHandler);

//#Logger
app.use(addLogger)


//#Handlebars
app.engine(
  "handlebars",
  handlebars.engine({ helpers: import("./helperHandlebars.js").helpers })
);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");


//#Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Coder House - Backend - Ecommerce",
      description: "API para el proyecto final del curso de backend de Coder House",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

app.use("/api/docs", passportCall("jwt"), isAuth, authorization(['user','premium','admin']), swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerJsdoc(swaggerOptions)));


//#Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/mail", mailRouter);
app.use("/api/mocking",mokingRouter)
app.use("/api/loggerTest",loggerRouter)
app.use("/api/users", usersRouter)
app.use("/", viewsRouter);

//levanto el servidor en el puerto indicado
const httpServer = app.listen(port, () =>
  console.log(`Server ON - ${port}`)
);
//socket.io srv
const io = new Server(httpServer);
io.on("connection", async (socket) => {
  //#Real Time Products
  console.log("New connection");
  //obtengo todos los productos
  const products = await productsService.getAll({limit: 100});
  socket.emit("realTimeProducts", products.payload);

  //Escucho evento newProduct
  socket.on("newProduct", async (data) => {
    const product = {
      title: data.title,
      description: data.description,
      code: data.code,
      price: data.price,
      status: true,
      stock: 10,
      category: "",
      thumbnails: data.thumbnails,
      owner: data.owner,
    };
    //creo el producto
    await productsService.addProduct(product);
    console.log("Product added");
    console.log(product);
    //obtengo todos los productos nuevamente
    const products = await productsService.getAll("");
    socket.emit("realTimeProducts", products.payload);
  });

  //Escucho evento deleteProduct
  socket.on("deleteProduct", async (data) => {
    await productsService.deleteProduct(data);
    //obtengo todos los productos nuevamente
    const products = await productsService.getAll("");
    socket.emit("realTimeProducts", products.payload);
  });

  //#Chat Ecommerce
  socket.on("newChatUser", (data) => {
    socket.broadcast.emit("newChatUser", data + " has joined the chat");
  });

  socket.on("newMessage", async (data) => {
    await messagesService.saveMessage(data);
    const messages = await messagesService.getAll();
    io.emit("messages", messages);
  });
});
