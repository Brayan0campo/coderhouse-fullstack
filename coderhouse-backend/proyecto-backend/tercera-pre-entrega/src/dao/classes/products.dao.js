import { productsModel } from "../models/products.model.js";

export default class Product {
  getAllProducts = async () => {
    try {
      const products = await productsModel.find();
      return products;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getProductById = async (productId) => {
    try {
      const product = await productsModel.findById(productId);
      return product;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  createProduct = async (productData) => {
    try {
      const newProduct = await productsModel.create(productData);
      return newProduct;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  updateProduct = async (productId, updatedProductData) => {
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
  };

  deleteProduct = async (productId) => {
    try {
      const deletedProduct = await productsModel.findByIdAndDelete(productId);
      return deletedProduct;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
