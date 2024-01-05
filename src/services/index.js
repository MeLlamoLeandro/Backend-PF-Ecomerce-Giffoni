import { Users, Products, Carts, Messages, Tickets } from "../dao/factory.js";
import UsersRepository from "./Users.repository.js";
import ProductsRepository from "./Products.repository.js";
import CartsRepository from "./Carts.repository.js";
import MessagesRepository from "./Messages.repository.js";
import TicketsRepository from "./Tickets.repository.js";

export const usersService = new UsersRepository(new Users());
export const productsService = new ProductsRepository(new Products());
export const cartsService = new CartsRepository(new Carts());
export const messagesService = new MessagesRepository(new Messages());
export const ticketsService = new TicketsRepository(new Tickets());