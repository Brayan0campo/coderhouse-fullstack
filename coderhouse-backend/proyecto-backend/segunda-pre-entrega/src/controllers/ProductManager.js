import { nanoid } from "nanoid";
import { promises as fs } from "fs";
import { productsModel } from "../models/products.model.js";

class ProductManager extends productsModel {
  constructor() {
    super();
  }

  async getProducts() {
    try {
      const products = await ProductManager.find({});
      return products;
    } catch (error) {
      console.error("Error getting products", error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductManager.findById(id).lean();

      if (!product) {
        return "Product not found";
      }

      return product;
    } catch (error) {
      console.error("Error getting product by ID", error);
      return "Error getting product by ID";
    }
  }

  async getProductsByLimit(limit) {
    try {
      const products = await ProductManager.find().limit(limit);

      if (products.length < limit) {
        limit = products.length;
      }

      return products;
    } catch (error) {
      throw error;
    }
  }

  async getProductsByPage(page, productsByPage) {
    if (page <= 0) {
      page = 1;
    }

    try {
      const products = await ProductManager.find()
        .skip((page - 1) * productsByPage)
        .limit(productsByPage);
      return products;
    } catch (error) {
      throw error;
    }
  }

  async getProductsByQuery(query) {
    try {
      const products = await productsModel.find({
        description: { $regex: query, $options: "i" },
      });
      return products;
    } catch (error) {
      throw error;
    }
  }

  async getProductsBySort(order) {
    try {
      const products = await productsModel.find({}).sort({ price: order });
      return products;
    } catch (error) {
      throw error;
    }
  }

  async getProductsAll(page = 1, limit = 10, category, available, order) {
    try {
      const filter = {};
      const initialIndex = (page - 1) * limit;
      const finalIndex = page * limit;
      const sortOption = {};

      if (order === "asc") {
        sortOption.price = 1;
      } else if (order === "desc") {
        sortOption.price = -1;
      } else {
        throw new Error("Invalid order parameter");
      }

      if (category != "") {
        filter.category = category;
      }

      if (available != "") {
        filter.available = available;
      }

      const query = ProductManager.find(filter)
        .skip(initialIndex)
        .limit(limit)
        .sort(sortOption);

      const products = await query.exec();
      const totalProducts = await ProductManager.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / limit);
      const previousPage = initialIndex > 0;
      const nextPage = finalIndex < totalProducts;
      const previousLink = previousPage
        ? `/api/products?page=${page - 1}&limit=${limit}`
        : null;
      const nextLink = nextPage
        ? `/api/products?page=${page + 1}&limit=${limit}`
        : null;

      return {
        status: "success",
        payload: products,
        totalPages: totalPages,
        prevPage: previousPage ? page - 1 : null,
        nextPage: nextPage ? page + 1 : null,
        page: page,
        previousPage: previousPage,
        nextPage: nextPage,
        previousLink: previousLink,
        nextLink: nextLink,
      };
    } catch (error) {
      console.error("Error getting products", error);
      return {
        status: "error",
        payload: "Error getting products",
      };
    }
  }

  async addProduct(productAdd) {
    try {
      await productsModel.create(productAdd);
      return "Product added";
    } catch (error) {
      console.error("Error adding product", error);
      return "Error adding product";
    }
  }

  async updateProduct(productId, updateProduct) {
    try {
      const product = await ProductManager.findById(productId);

      if (!product) {
        return "Product not found";
      }

      product.set(updateProduct);
      await product.save();
      return "Product updated";
    } catch (error) {
      console.error("Error updating product", error);
      return "Error updating product";
    }
  }

  async deleteProduct(productId) {
    try {
      const product = await ProductManager.findById(productId);

      if (!product) {
        return "Product not found";
      }

      await product.remove();
      return "Product deleted";
    } catch (error) {
      console.error("Error deleting product", error);
      return "Error deleting product";
    }
  }
}

export default ProductManager;
