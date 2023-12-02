import { ticketsModel } from "./models/tickets.model.js";

export default class TicketsMongo {
  constructor() {}

  get = async () => {
    try {
      const tickets = await ticketsModel.find();
      return tickets;
    } catch (error) {
      console.error("Error getting tickets: ", error);
      return "Error getting tickets";
    }
  };

  createTicket = async (newTicket) => {
    try {
      const ticket = await ticketsModel.create(newTicket);
      return ticket;
    } catch (error) {
      console.error("Error creating ticket: ", error);
      return "Error creating ticket";
    }
  };
}
