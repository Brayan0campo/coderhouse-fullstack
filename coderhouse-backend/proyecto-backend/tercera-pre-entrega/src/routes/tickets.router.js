import express from "express";
import TicketsDTO from "../dao/DTOs/tickets.dto.js";
import Tickets from "../dao/mongo/tickets.mongo.js";
import { ticketsServices } from "../repositories/index.js";

const ticketsMongo = new Tickets();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tickets = await ticketsMongo.get();
    res.send({ status: "success", payload: tickets });
  } catch (error) {
    res.send({ status: "error", payload: error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await ticketsMongo.getTicket(id);
    res.send({ status: "success", payload: ticket });
  } catch (error) {
    res.send({ status: "error", payload: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { amount, purchaser } = req.body;
    const ticket = new TicketsDTO(amount, purchaser);
    const createdTicket = await ticketsServices.createTicket(ticket);
    res.send({ status: "success", payload: createdTicket });
  } catch (error) {
    res.send({ status: "error", payload: error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, purchaser } = req.body;
    const ticket = new TicketsDTO(amount, purchaser);
    const updatedTicket = await ticketsServices.updateTicket(id, ticket);
    res.send({ status: "success", payload: updatedTicket });
  } catch (error) {
    res.send({ status: "error", payload: error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTicket = await ticketsServices.deleteTicket(id);
    res.send({ status: "success", payload: deletedTicket });
  } catch (error) {
    res.send({ status: "error", payload: error });
  }
});

export default router;
