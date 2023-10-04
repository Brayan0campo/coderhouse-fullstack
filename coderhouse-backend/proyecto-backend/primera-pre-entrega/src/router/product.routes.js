import { Router } from "express";
import PrductManager from "../controllers/ProductManager.js";

const productRouter = Router();
const productManager = new PrductManager();

productRouter.get("/", async (req, res) => {
  res.send(await productManager.getProduct());
});

productRouter.get("/:id", async (req, res) => {
  let id = req.params.id;
  res.send(await productManager.getProductById(id));
});

productRouter.post("/", async (req, res) => {
  let newProduct = req.body;
  res.send(await productManager.addProduct(newProduct));
});

productRouter.put("/:id", async (req, res) => {
  let id = req.params.id;
  let updateProduct = req.body;
  res.send(await productManager.updateProduct(id, updateProduct));
});

productRouter.delete("/:id", async (req, res) => {
  let id = req.params.id;
  res.send(await productManager.deleteProduct(id));
});

export default productRouter;
