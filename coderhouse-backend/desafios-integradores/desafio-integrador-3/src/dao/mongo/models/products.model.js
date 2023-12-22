import mongoose from "mongoose";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
  description: { type: String, max: 100 },
  category: { type: String, max: 100 },
  price: { type: Number },
  stock: { type: Number },
  available: { type: String, enum: ["in_stock", "out_of_stock"] },
  owner: { type: String},
});

export const productsModel = mongoose.model(productsCollection, productsSchema);
