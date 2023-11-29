import ticketsModel from "./models/tickets.model.js";

export default class TicketsMongo {
  constructor() {}

  get = async () => {
    try {
      const tickets = await ticketsModel.find();
      return tickets;
    } catch (err) {
      console.log(err);
    }
  };

  getById = async (id) => {
    try {
      const ticket = await ticketsModel.findById(id);
      return ticket;
    } catch (err) {
      console.log(err);
    }
  };

  createTicket = async (newTicket) => {
    try {
      const ticket = await ticketsModel.create(newTicket);
      return ticket;
    } catch (err) {
      console.log(err);
    }
  };

  updateTicket = async (id, ticket) => {
    try {
      const updatedTicket = await ticketsModel.findByIdAndUpdate(id, ticket, {
        new: true,
      });
      return updatedTicket;
    } catch (err) {
      console.log(err);
    }
  };

  deleteTicket = async (id) => {
    try {
      const deletedTicket = await ticketsModel.findByIdAndDelete(id);
      return deletedTicket;
    } catch (err) {
      console.log(err);
    }
  };
}
