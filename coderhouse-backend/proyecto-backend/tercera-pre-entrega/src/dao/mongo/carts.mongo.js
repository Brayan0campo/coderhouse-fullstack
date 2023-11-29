import cartsModel from "./models/carts.model.js";

export default class CartsMongo {
  constructor() {}

  get = async () => {
    try {
      const carts = await cartsModel.find();
      return carts;
    } catch (err) {
      console.log(err);
    }
  };

  getById = async (id) => {
    try {
      const cart = await cartsModel.findById(id);
      return cart;
    } catch (err) {
      console.log(err);
    }
  };

  createCart = async (newCart) => {
    try {
      const newCart = await cartsModel.create(newCart);
      return newCart;
    } catch (err) {
      console.log(err);
    }
  };

  updateCart = async (id, cart) => {
    try {
      const updatedCart = await cartsModel.findByIdAndUpdate(id, cart, {
        new: true,
      });
      return updatedCart;
    } catch (err) {
      console.log(err);
    }
  };

  deleteCart = async (id) => {
    try {
      const deletedCart = await cartsModel.findByIdAndDelete(id);
      return deletedCart;
    } catch (err) {
      console.log(err);
    }
  };
}
