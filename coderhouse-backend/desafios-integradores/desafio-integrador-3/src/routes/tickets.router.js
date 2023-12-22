import express from "express";
import { logger } from "../logger.js";
import TicketsDTO from "../dao/DTOs/tickets.dto.js";
import Tickets from "../dao/mongo/tickets.mongo.js";
import { ticketsServices } from "../repositories/index.js";

const ticketsMongo = new Tickets();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tickets = await ticketsMongo.get();
    logger.info("Tickets retrieved successfully");
    res.send({ status: "success", payload: tickets });
  } catch (error) {
    logger.error("Error retrieving tickets");
    res.send({ status: "error", payload: error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await ticketsMongo.getTicket(id);
    logger.info("Ticket retrieved successfully");
    res.send({ status: "success", payload: ticket });
  } catch (error) {
    logger.error("Error retrieving ticket");
    res.send({ status: "error", payload: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { amount, purchaser } = req.body;
    const ticket = new TicketsDTO(amount, purchaser);
    const createdTicket = await ticketsServices.createTicket(ticket);
    logger.info("Ticket created successfully");
    res.send({ status: "success", payload: createdTicket });
  } catch (error) {
    logger.error("Error creating ticket");
    res.send({ status: "error", payload: error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, purchaser } = req.body;
    const ticket = new TicketsDTO(amount, purchaser);
    const updatedTicket = await ticketsServices.updateTicket(id, ticket);
    logger.info("Ticket updated successfully");
    res.send({ status: "success", payload: updatedTicket });
  } catch (error) {
    logger.error("Error updating ticket");
    res.send({ status: "error", payload: error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTicket = await ticketsServices.deleteTicket(id);
    logger.info("Ticket deleted successfully");
    res.send({ status: "success", payload: deletedTicket });
  } catch (error) {
    logger.error("Error deleting ticket");
    res.send({ status: "error", payload: error });
  }
});

export default router;
