import { cartsModel } from "../models/carts.model.js";

export default class Carts {
  static async getCartById(cartId) {
    try {
      const cart = await cartsModel
        .findById(cartId)
        .populate("products.productId");
      return cart;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async createCart(products) {
    try {
      const newCart = await cartsModel.create({ products });
      return newCart;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async updateCart(cartId, updatedCartData) {
    try {
      const updatedCart = await cartsModel.findByIdAndUpdate(
        cartId,
        { $set: updatedCartData },
        { new: true }
      );
      return updatedCart;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async deleteCart(cartId) {
    try {
      const deletedCart = await cartsModel.findByIdAndDelete(cartId);
      return deletedCart;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
