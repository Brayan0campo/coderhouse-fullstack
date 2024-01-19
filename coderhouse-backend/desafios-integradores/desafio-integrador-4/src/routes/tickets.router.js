import express from "express";
import { logger } from "../logger.js";
import TicketsDTO from "../dao/DTOs/tickets.dto.js";
import Tickets from "../dao/mongo/tickets.mongo.js";
import { ticketsServices } from "../repositories/index.js";

const ticketsMongo = new Tickets();
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const tickets = await ticketsMongo.get();
    logger.info("Tickets retrieved successfully");
    res.status(200).json({ status: "success", payload: tickets });
  } catch (error) {
    logger.error("Error retrieving tickets", error);
    res
      .status(500)
      .json({ status: "error", message: "Error retrieving tickets" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await ticketsMongo.getTicket(id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    logger.info("Ticket retrieved successfully");
    res.send({ status: "success", payload: ticket });
  } catch (error) {
    logger.error("Error retrieving ticket", error);
    res.status(404).send({ status: "error", payload: "Ticket not found" });
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
    res.status(400).send({ status: "error", payload: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { amount, purchaser } = req.body;
  try {
    const ticket = new TicketsDTO(amount, purchaser);
    const updatedTicket = await ticketsServices.updateTicket(id, ticket);
    logger.info("Ticket updated successfully");
    res.status(200).json({ status: "success", payload: updatedTicket });
  } catch (error) {
    logger.error("Error updating ticket", error);
    res.status(500).json({ status: "error", message: "Error updating ticket" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTicket = await ticketsServices.deleteTicket(id);
    logger.info("Ticket deleted successfully");
    res.send({ status: "success", payload: deletedTicket });
  } catch (error) {
    logger.error("Error deleting ticket");
    res.status(500).send({ status: "error", message: "Internal Server Error" });
  }
});

export default router;
