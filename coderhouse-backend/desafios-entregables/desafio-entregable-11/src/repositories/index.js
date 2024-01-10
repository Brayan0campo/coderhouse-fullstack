import { Carts, Products, Users, Tickets } from "../dao/factory.js";

import CartRepository from "./carts.repository.js";
import ProductRepository from "./products.repository.js";
import UserRepository from "./users.repository.js";
import TicketRepository from "./tickets.repository.js";

export const cartsServices = new CartRepository(new Carts());
export const productsServices = new ProductRepository(new Products());
export const usersServices = new UserRepository(new Users());
export const ticketsServices = new TicketRepository(new Tickets());
