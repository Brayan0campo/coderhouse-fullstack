import Carts from "../dao/classes/carts.dao.js";

const cartService = new Carts();

export const getCartById = async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await cartService.getCartById(cartId);
    res.send({ status: "success", result: cart });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const createCart = async (req, res) => {
  const { products } = req.body;
  try {
    const newCart = await cartService.createCart(products);
    res.status(201).send({ status: "success", result: newCart });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const updateCart = async (req, res) => {
  const { cartId } = req.params;
  const updatedCartData = req.body;
  try {
    const updatedCart = await cartService.updateCart(cartId, updatedCartData);
    res.send({ status: "success", result: updatedCart });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const deleteCart = async (req, res) => {
  const { cartId } = req.params;
  try {
    const deletedCart = await cartService.deleteCart(cartId);
    res.send({ status: "success", result: deletedCart });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};
