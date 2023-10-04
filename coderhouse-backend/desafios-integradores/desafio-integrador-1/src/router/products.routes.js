import { Router } from "express";
import { productsModel } from "../models/products.model.js";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    const products = await productsModel.find();
    res.send({ result: "success", payload: products });
  } catch (error) {
    console.log(error);
  }
});

productRouter.post("/", async (req, res) => {
  const { title, description, category, price, stock } = req.body;

  if (!title || !description || !category || !price || !stock) {
    res
      .status(400)
      .send({ result: "error", message: "All fields are required" });
  }

  const result = await productsModel.create({
    title,
    description,
    category,
    price,
    stock,
  });

  res.send({ result: "success", payload: result });
});

productRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updateProduct = req.body;

  if (
    !updateProduct.title ||
    !updateProduct.description ||
    !updateProduct.category ||
    !updateProduct.price ||
    !updateProduct.stock
  ) {
    res
      .status(400)
      .send({ result: "error", message: "All fields are required" });
  }

  const result = await productsModel.updateOne({ _id: id }, updateProduct);
  res.send({ result: "success", payload: result });
});

productRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await productsModel.deleteOne({ _id: id });
  res.send({ result: "success", payload: result });
});

export default productRouter;
