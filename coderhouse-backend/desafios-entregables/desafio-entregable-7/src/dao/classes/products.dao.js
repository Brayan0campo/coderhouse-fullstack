import { productsModel } from "../models/products.model.js";

export default class Product {
  static async getAllProducts() {
    try {
      const products = await productsModel.find();
      return products;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async getProductById(productId) {
    try {
      const product = await productsModel.findById(productId);
      return product;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async createProduct(productData) {
    try {
      const newProduct = await productsModel.create(productData);
      return newProduct;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async updateProduct(productId, updatedProductData) {
    try {
      const updatedProduct = await productsModel.findByIdAndUpdate(
        productId,
        updatedProductData,
        { new: true }
      );
      return updatedProduct;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async deleteProduct(productId) {
    try {
      const deletedProduct = await productsModel.findByIdAndDelete(productId);
      return deletedProduct;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
