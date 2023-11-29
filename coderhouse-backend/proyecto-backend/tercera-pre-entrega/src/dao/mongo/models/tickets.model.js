import mongoose from "mongoose";

const ticketsCollection = "tickets";

const ticketsSchema = new mongoose.Schema({
  code: { type: String, max: 100, unique: true, required: true },
  purchaser: { type: String, max: 30, required: true },
  amount: { type: Number },
  purchase_datetime: { type: Date, default: Date.now },
});

export const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);
