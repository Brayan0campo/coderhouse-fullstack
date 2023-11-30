import mongoose from "mongoose";
import productsModel from "./models/products.model.js";

export default class ProductsMongo {
  constructor() {}

  get = async () => {
    try {
      const products = await productsModel.find().lean();
      return products;
    } catch (error) {
      console.error("Error getting products: ", error);
      return "Error getting products";
    }
  };

  getProduct = async (id) => {
    try {
      const product = await productsModel.findById(id).lean();
      if (!product) {
        return { error: "Product not found" };
      }
      return product;
    } catch (error) {
      console.error("Error getting product: ", error);
      return "Error getting product";
    }
  };

  createProduct = async (product) => {
    try {
      const newProduct = await productsModel.create(product);
      return newProduct;
    } catch (error) {
      console.error("Error creating product: ", error);
      return "Error creating product";
    }
  };

  updateProduct = async (id, product) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return { error: "Invalid id" };
      }

      const updatedProduct = await productsModel.updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: product }
      );

      return updatedProduct;
    } catch (error) {
      console.error("Error updating product: ", error);
      return "Error updating product";
    }
  };

  deleteProduct = async (id) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return { error: "Invalid id" };
      }

      const deletedProduct = await productsModel.deleteOne({
        _id: new mongoose.Types.ObjectId(id),
      });

      return deletedProduct;
    } catch (error) {
      console.error("Error deleting product: ", error);
      return "Error deleting product";
    }
  };
}
