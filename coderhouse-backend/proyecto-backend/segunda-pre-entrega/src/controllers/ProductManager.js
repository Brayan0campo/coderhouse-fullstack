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

  async getProductsBySort(sort) {
    try {
      const products = await productsModel.find({}).sort({ price: sort });
      return products;
    } catch (error) {
      throw error;
    }
  }

  async getProductsAll(page = 1, limit = 10, category, available, sort) {
    try {
      const filter = {};
      const initialIndex = (page - 1) * limit;
      const finalIndex = page * limit;
      const sortOption = {};

      if (sort === "asc") {
        sortOption.price = 1;
      } else if (sort === "desc") {
        sortOption.price = -1;
      } else {
        throw new Error("Invalid sort parameter");
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
      const hasPrevPage = initialIndex > 0;
      const hasNextPage = finalIndex < totalProducts;
      const prevLink = hasPrevPage
        ? `/api/products?page=${page - 1}&limit=${limit}`
        : null;
      const nextLink = hasNextPage
        ? `/api/products?page=${page + 1}&limit=${limit}`
        : null;

      return {
        status: "success",
        payload: products,
        totalPages: totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page: page,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        prevLink: prevLink,
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
