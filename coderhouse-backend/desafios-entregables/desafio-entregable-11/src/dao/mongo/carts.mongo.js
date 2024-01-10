import { cartsModel } from "./models/carts.model.js";
import { productsModel } from "./models/products.model.js";
import { errorMessagesCarts } from "../../services/custom-errors/errors.dictionary.js";

export default class CartsMongo {
  constructor() {}

  get = async () => {
    try {
      const carts = await cartsModel.find();
      return carts;
    } catch (error) {
      console.error("Error getting carts: ", error);
      return errorMessagesCarts.errorGettingCarts;
    }
  };

  getCart = async (id) => {
    try {
      const cart = await cartsModel.findById(id);
      if (!cart) {
        return { error: "Cart not found" };
      }
      return cart;
    } catch (error) {
      console.error("Error getting cart: ", error);
      return errorMessagesCarts.errorGettingCart;
    }
  };

  getStock = async ({ products }) => {
    try {
      const stockInformation = {};
      const stockErrors = [];

      for (const product of products) {
        const productFound = await productsModel.findOne({
          description: product.description,
        });
        if (!productFound) {
          stockErrors.push(`Product ${product.description} not found`);
          stockInformation[product.description] = { status: "not found" };
          continue;
        }

        if (productFound.stock >= product.stock) {
          await productsModel.findByIdAndUpdate(productFound._id, {
            stock: productFound.stock - product.stock,
          });
          stockInformation[product.description] = { status: "ok" };
        } else {
          stockErrors.push(
            `Product ${product.description} has not enough stock`
          );
          stockInformation[product.description] = {
            status: "not enough stock",
          };
        }

        if (stockErrors.length > 0) {
          return { stockErrors, stockInformation };
        }

        return { stockInformation };
      }
    } catch (error) {
      console.error("Error getting stock: ", error);
      return errorMessagesCarts.errorGettingStock;
    }
  };

  getAmount = async ({ products }) => {
    try {
      let amount = 0;

      if (!products || !Array.isArray(products)) {
        console.error("Error getting amount: ", error);
        return "Error getting amount";
      }

      for (const product of products) {
        amount += product.price * product.stock;
      }

      return { amount };
    } catch (error) {
      console.error("Error getting amount: ", error);
      return errorMessagesCarts.errorGettingAmount;
    }
  };

  createCart = async (newCart) => {
    try {
      const cart = await cartsModel.create(newCart);
      return cart;
    } catch (error) {
      console.error("Error creating cart: ", error);
      return errorMessagesCarts.errorCreatingCart;
    }
  };

  updateCart = async (id, cart) => {
    try {
      const updatedCart = await cartsModel.findById(id, cart, {
        new: true,
      });
      if (!updatedCart) {
        return { error: "Cart not found" };
      }
      return updatedCart;
    } catch (error) {
      console.error("Error updating cart: ", error);
      return errorMessagesCarts.errorUpdatingCart;
    }
  };

  deleteCart = async (id) => {
    try {
      const deletedCart = await cartsModel.findByIdAndDelete(id);
      if (!deletedCart) {
        return { error: "Cart not found" };
      }
      return deletedCart;
    } catch (error) {
      console.error("Error deleting cart: ", error);
      return errorMessagesCarts.errorDeletingCart;
    }
  };
}
