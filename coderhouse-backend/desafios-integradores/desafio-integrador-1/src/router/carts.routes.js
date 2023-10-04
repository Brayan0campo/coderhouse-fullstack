import { Router } from "express";
import { cartsModel } from "../models/carts.model.js";

const cartRouter = Router();

cartRouter.get("/", async (req, res) => {
  try {
    const carts = await cartsModel.find();
    res.send({ result: "success", payload: carts });
  } catch (error) {
    console.log(error);
  }
});

cartRouter.post("/", async (req, res) => {
  const { title, description, quantity, total } = req.body;

  if (!title || !description || !quantity || !total) {
    res
      .status(400)
      .send({ result: "error", message: "All fields are required" });
  }

  const result = await cartsModel.create({
    title,
    description,
    quantity,
    total,
  });

  res.send({ result: "success", payload: result });
});

cartRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updateCart = req.body;

  if (
    !updateCart.title ||
    !updateCart.description ||
    !updateCart.quantity ||
    !updateCart.total
  ) {
    res
      .status(400)
      .send({ result: "error", message: "All fields are required" });
  }

  const result = await cartsModel.updateOne({ _id: id }, updateCart);
  res.send({ result: "success", payload: result });
});

cartRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await cartsModel.deleteOne({ _id: id });
  res.send({ result: "success", payload: result });
});

export default cartRouter;
