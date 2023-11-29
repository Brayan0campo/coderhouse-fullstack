import nanoid from "nanoid";

export default class TicketsDTO {
  constructor(ticket) {
    this.code = nanoid();
    this.amount = ticket.amount;
    this.purchaser = ticket.purchaser;
    this.purchase_datetime = new Date();
  }
}
