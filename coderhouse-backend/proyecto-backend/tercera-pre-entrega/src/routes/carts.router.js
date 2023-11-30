import express from "express";
import CartsDTO from "../dao/DTOs/carts.dto.js";
import Carts from "../dao/mongo/carts.mongo.js";
import TicketsDTO from "../dao/DTOs/tickets.dto.js";
import { cartsServices, ticketsServices } from "../repositories/index.js";

const cartsMongo = new Carts();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const carts = await cartsMongo.get();
    res.send({ status: "success", payload: carts });
  } catch (error) {
    res.send({ status: "error", payload: error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await cartsMongo.getCart(id);
    res.send({ status: "success", payload: cart });
  } catch (error) {
    res.send({ status: "error", payload: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { products } = req.body;
    const cart = new CartsDTO({ products });
    const createdCart = await cartsServices.createCart(cart);
    res.send({ status: "success", payload: createdCart });
  } catch (error) {
    res.send({ status: "error", payload: error });
  }
});

router.post("/:cid/purchase", async (req, res) => {
  try {
    const idCart = req.params.cid;
    const products = req.body.products;
    const email = req.body.email;

    const cart = await cartsServices.getCart(idCart);
    if (!cart) {
      return { error: "Cart not found" };
    }

    const validateStock = await cartsServices.getStock({ products });
    if (validateStock) {
      const amount = await cartsServices.getAmount({ products });
      const ticketFormat = new TicketsDTO({ amount: amount, purchaser: email });
      const ticket = await ticketsServices.createTicket(ticketFormat);
      return { status: "success", payload: ticket };
    } else {
      return { error: "There is no stock" };
    }
  } catch (error) {
    res.send({ status: "error", payload: error });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { products } = req.body;
  try {
    const cart = await cartsMongo.update(id, products);
    res.send({ status: "success", payload: cart });
  } catch (error) {
    res.send({ status: "error", payload: error });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await cartsMongo.delete(id);
    res.send({ status: "success", payload: cart });
  } catch (error) {
    res.send({ status: "error", payload: error });
  }
});

export default router;
