import TicketsDTO from "../dao/dtos/tickets.dto.js";

export default class TicketsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  get = async () => {
    try {
      const tickets = await this.dao.get();
      return tickets;
    } catch (error) {
      console.error("Error getting tickets: ", error);
      return "Error getting tickets";
    }
  };

  getTicket = async (id) => {
    try {
      const ticket = await this.dao.getTicket(id);
      if (!ticket) {
        return { error: "Ticket not found" };
      }
      return ticket;
    } catch (error) {
      console.error("Error getting ticket: ", error);
      return "Error getting ticket";
    }
  };

  createTicket = async (ticket) => {
    try {
      const newTicket = await TicketsDTO(ticket);
      const createdTicket = await this.dao.createTicket(newTicket);
      return createdTicket;
    } catch (error) {
      console.error("Error creating ticket: ", error);
      return "Error creating ticket";
    }
  };

  updateTicket = async (id, ticket) => {
    try {
      const updatedTicket = await this.dao.updateTicket(id, ticket);
      return updatedTicket;
    } catch (error) {
      console.error("Error updating ticket: ", error);
      return "Error updating ticket";
    }
  };

  deleteTicket = async (id) => {
    try {
      const deletedTicket = await this.dao.deleteTicket(id);
      return deletedTicket;
    } catch (error) {
      console.error("Error deleting ticket: ", error);
      return "Error deleting ticket";
    }
  };
}
