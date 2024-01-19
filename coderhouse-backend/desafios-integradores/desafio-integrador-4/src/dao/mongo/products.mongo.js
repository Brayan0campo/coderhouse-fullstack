import mongoose from "mongoose";
import { productsModel } from "./models/products.model.js";
import { errorMessagesProducts } from "../../services/custom-errors/errors.dictionary.js";

export default class ProductsMongo {
  constructor() {}

  get = async () => {
    try {
      const products = await productsModel.find().lean();
      return products;
    } catch (error) {
      console.error("Error getting products: ", error);
      return errorMessagesProducts.errorGettingProducts;
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
      return errorMessagesProducts.errorGettingProduct;
    }
  };

  createProduct = async (product) => {
    try {
      const newProduct = await productsModel.create(product);
      return newProduct;
    } catch (error) {
      console.error("Error creating product: ", error);
      return errorMessagesProducts.errorCreatingProduct;
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
      return errorMessagesProducts.errorUpdatingProduct;
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
      return errorMessagesProducts.errorDeletingProduct;
    }
  };
}
