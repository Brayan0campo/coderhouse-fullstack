import CartDTO from "../dao/dtos/carts.dto.js";

export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  get = async () => {
    try {
      const carts = await this.dao.get();
      return carts;
    } catch (error) {
      console.error("Error getting carts: ", error);
      return "Error getting carts";
    }
  };

  getCart = async (id) => {
    try {
      const cart = await this.dao.getCart(id);
      if (!cart) {
        return { error: "Cart not found" };
      }
      return cart;
    } catch (error) {
      console.error("Error getting cart: ", error);
      return "Error getting cart";
    }
  };

  getStock = async ({ products }) => {
    try {
      const stock = await this.dao.getStock({ products });
      return stock;
    } catch (error) {
      console.error("Error getting stock: ", error);
      return "Error getting stock";
    }
  };

  getAmount = async ({ products }) => {
    try {
      const amount = await this.dao.getAmount({ products });
      return amount;
    } catch (error) {
      console.error("Error getting amount: ", error);
      return "Error getting amount";
    }
  };

  createCart = async (cart) => {
    try {
      const newCart = await CartDTO(cart);
      const createdCart = await this.dao.createCart(newCart);
      return createdCart;
    } catch (error) {
      console.error("Error creating cart: ", error);
      return "Error creating cart";
    }
  };

  updateCart = async (id, cart) => {
    try {
      const updatedCart = await this.dao.updateCart(id, cart);
      return updatedCart;
    } catch (error) {
      console.error("Error updating cart: ", error);
      return "Error updating cart";
    }
  };

  deleteCart = async (id) => {
    try {
      const deletedCart = await this.dao.deleteCart(id);
      return deletedCart;
    } catch (error) {
      console.error("Error deleting cart: ", error);
      return "Error deleting cart";
    }
  };
}
