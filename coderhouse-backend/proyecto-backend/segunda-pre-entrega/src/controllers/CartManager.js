import { nanoid } from "nanoid";
import { promises as fs } from "fs";
import { cartsModel } from "../models/carts.model.js";
import ProductManager from "./ProductManager.js";

const productManager = new ProductManager();

class CartManager extends cartsModel {
  constructor() {
    super();
  }

  async getCarts() {
    try {
      const carts = await CartManager.find({}).populate({
        path: "products.productId",
        model: "products",
        select: "description category price stock",
      });
      return carts;
    } catch (error) {
      console.log("Error getting carts", error);
      return [];
    }
  }

  async getCartById(id) {
    try {
      const cart = await cartsModel.findById(id);

      if (!cart) {
        return "Cart not found";
      }

      return cart;
    } catch (error) {
      console.error("Error getting cart", error);
      return "Error getting cart";
    }
  }

  async getCartWithProducts(cartId) {
    try {
      const cart = await cartsModel
        .findById(cartId)
        .populate("products.productId")
        .lean();

      if (!cart) {
        return "Cart not found";
      }

      return cart;
    } catch (error) {
      console.error("Error getting cart", error);
      return "Error getting cart";
    }
  }

  async addCart(cartAdd) {
    try {
      await cartsModel.create(cartAdd);
      return "Cart added";
    } catch (error) {
      console.error("Error adding cart", error);
      return "Error adding cart";
    }
  }

  async addProductInCart(cartId, prodId) {
    try {
      const cart = await cartsModel.findById(cartId);

      if (!cart) {
        return "Cart not found";
      }

      const validatedProduct = cart.products.find(
        (product) => product.productId === prodId
      );

      if (validatedProduct) {
        validatedProduct.quantity++;
      } else {
        cart.products.push({ productId: prodId, quantity: 1 });
      }

      await cart.save();
      return "Product added to cart";
    } catch (error) {
      console.error("Error adding product to cart", error);
      return "Error adding product to cart";
    }
  }

  async updateProductInCart(cartId, prodId, updateProduct) {
    try {
      const cart = await cartsModel.findById(cartId);

      if (!cart) {
        return "Cart not found";
      }

      const productUpdate = cart.products.find(
        (product) => product.productId === prodId
      );

      if (!productUpdate) {
        return "Product not found in cart";
      }

      Object.assign(productUpdate, updateProduct);
      await cart.save();
      return "Product updated in cart";
    } catch (error) {
      console.error("Error updating product in cart", error);
      return "Error updating product in cart";
    }
  }

  async updateProductsInCart(cartId, updateProducts) {
    try {
      const cart = await cartsModel.findById(cartId);

      if (!cart) {
        return "Cart not found";
      }

      cart.products = updateProducts;
      await cart.save();
      return "Products updated in cart";
    } catch (error) {
      console.error("Error updating products in cart", error);
      return "Error updating products in cart";
    }
  }

  async deleteProductInCart(cartId, prodId) {
    try {
      const cart = await cartsModel.findById(cartId);

      if (!cart) {
        return "Cart not found";
      }

      const productIndex = cart.products.findIndex(
        (product) => product.productId === prodId
      );

      if (productIndex !== -1) {
        cart.products.splice(productIndex, 1);
        await cart.save();
        return "Product deleted from cart";
      } else {
        return "Product not found in cart";
      }
    } catch (error) {
      console.error("Error deleting product in cart", error);
      return "Error deleting product in cart";
    }
  }

  async deleteProductsInCart(cartId) {
    try {
      const cart = await cartsModel.findById(cartId);

      if (!cart) {
        return "Cart not found";
      }

      cart.products = [];
      await cart.save();
      return "Products deleted from cart";
    } catch (error) {
      console.error("Error deleting products in cart", error);
      return "Error deleting products in cart";
    }
  }
}

export default CartManager;
