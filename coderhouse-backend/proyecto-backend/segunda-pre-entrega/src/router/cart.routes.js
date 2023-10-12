import { Router } from "express";
import CartManager from "../controllers/CartManager.js";

const cartRouter = Router();
const cartManager = new CartManager();

cartRouter.get("/", async (req, res) => {
  res.send(await cartManager.getCart());
});

cartRouter.get("/population/:cid", async (req, res) => {
  let cartId = req.params.cid;
  res.send(await cartManager.getCartWithProducts(cartId));
});

cartRouter.get("/:id", async (req, res) => {
  res.send(await cartManager.getCartById(req.params.id));
});

cartRouter.post("/", async (req, res) => {
  const newCart = req.body;
  res.send(await cartManager.addCart(newCart));
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  res.send(await cartManager.addProductInCart(cartId, productId));
});

cartRouter.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const updateCart = req.body;
  res.send(await cartManager.updateCart(cartId, updateCart));
});

cartRouter.put("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const updateProduct = req.body;
  res.send(
    await cartManager.updateProductInCart(cartId, productId, updateProduct)
  );
});

cartRouter.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  res.send(await cartManager.deleteCart(cartId));
});

cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  res.send(await cartManager.deleteProductInCart(cartId, productId));
});

export default cartRouter;
