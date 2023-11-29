import CartDTO from "../dao/dtos/carts.dto";

export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAllCarts() {
    const carts = await this.dao.getAllCarts();
    return carts;
  }

  async getCartById(id) {
    const cart = await this.dao.getCartById(id);
    return cart;
  }

  async createCart(cart) {
    const cartDTO = new CartDTO(cart);
    const newCart = await this.dao.createCart(cartDTO);
    return newCart;
  }

  async updateCart(id, cart) {
    const cartDTO = new CartDTO(cart);
    const updatedCart = await this.dao.updateCart(id, cartDTO);
    return updatedCart;
  }

  async deleteCart(id) {
    const deletedCart = await this.dao.deleteCart(id);
    return deletedCart;
  }
}
