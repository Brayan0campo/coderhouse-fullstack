import express from "express";
import { logger } from "../logger.js";
import Carts from "../dao/mongo/carts.mongo.js";
import CartsDTO from "../dao/DTOs/carts.dto.js";
import TicketsDTO from "../dao/DTOs/tickets.dto.js";
import {
  cartsServices,
  ticketsServices,
  usersServices,
} from "../repositories/index.js";

const cartsMongo = new Carts();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const carts = await cartsMongo.get();
    logger.info("Carts retrieved successfully");
    res.status(200).json({ status: "success", payload: carts });
  } catch (error) {
    logger.error("Error retrieving carts", error);
    res.status(500).json({ status: "error", payload: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await cartsMongo.getCart(id);
    logger.info("Cart retrieved successfully");
    res.status(200).send({ status: "success", payload: cart });
  } catch (error) {
    logger.error("Error retrieving cart", error);
    res
      .status(500)
      .send({ status: "error", message: "Unable to retrieve cart." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { products, email } = req.body;
    const userRole = usersServices.getUserRole(products.owner);

    if (userRole === "premium" && email === products.owner) {
      logger.error("A premium user cannot add their own product to the cart.");
      return res.status(500).send({
        status: "error",
        message: "A premium user cannot add their own product to the cart.",
      });
    }

    const cart = new CartsDTO({ products });
    const createdCart = await cartsServices.createCart(cart);

    logger.info("Cart created successfully");
    res.send({ status: "success", payload: createdCart });
  } catch (error) {
    logger.error("Error creating cart", error);
    res.status(500).send({ status: "error", payload: error.message });
  }
});

router.post("/:cid/purchase", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products, email } = req.body;
    const cart = await cartsServices.getCart(cid);

    if (!cart) {
      logger.error("Cart not found");
      return res.status(404).json({ error: "Cart not found" });
    }

    const validateStock = await cartsServices.getStock({ products });

    if (validateStock) {
      const amount = await cartsServices.getAmount({ products });
      const ticketFormat = new TicketsDTO({ amount: amount, purchaser: email });
      const ticket = await ticketsServices.createTicket(ticketFormat);
      logger.info("Ticket created successfully");
      return res.status(200).json({ status: "success", payload: ticket });
    } else {
      logger.error("There is no stock");
      return res.status(400).json({ error: "There is no stock" });
    }
  } catch (error) {
    logger.error("Error creating ticket", error);
    res.status(500).json({ status: "error", payload: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { products } = req.body;
  try {
    const cart = await cartsMongo.updateCart(id, products);
    logger.info("Cart updated successfully");
    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    logger.error("Error updating cart", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await cartsMongo.deleteCart(id);

    if (cart) {
      logger.info("Cart deleted successfully");
      res
        .status(200)
        .json({ status: "success", message: "Cart deleted successfully" });
    } else {
      logger.warn(`Cart with ID ${id} not found`);
      res
        .status(404)
        .json({ status: "error", message: `Cart with ID ${id} not found` });
    }
  } catch (error) {
    logger.error("Error deleting cart", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

export default router;
