import mongoose from "mongoose";

const productsCollection = "products";

const productSchema = new mongoose.Schema({
  description: { type: String, max: 100 },
  category: { type: String, max: 50 },
  price: { type: Number },
  stock: { type: Number },
  available: { type: String, enum: ["in_stock", "out_of_stock"] },
});

export const productsModel = mongoose.model(productsCollection, productSchema);
