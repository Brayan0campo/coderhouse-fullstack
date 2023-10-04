import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  title: { type: String, max: 100, required: true },
  description: { type: String, max: 100, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);
