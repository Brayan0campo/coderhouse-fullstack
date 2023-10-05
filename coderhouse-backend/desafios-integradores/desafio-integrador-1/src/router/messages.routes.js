import { Router } from "express";
import { messagesModel } from "../models/messages.model.js";

const messageRouter = Router();

messageRouter.get("/", async (req, res) => {
  try {
    const messages = await messagesModel.find();
    res.send({ result: "success", payload: messages });
  } catch (error) {
    console.log(error);
  }
});

messageRouter.post("/", async (req, res) => {
  const { user, message } = req.body;

  if (!user || !message) {
    res
      .status(400)
      .send({ result: "error", message: "All fields are required" });
  }

  const result = await messagesModel.create({ user, message });
  res.send({ result: "success", payload: result });
});

messageRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updateMessage = req.body;

  if (!updateMessage.user || !updateMessage.message) {
    res
      .status(400)
      .send({ result: "error", message: "All fields are required" });
  }

  const result = await messagesModel.updateOne({ _id: id }, updateMessage);
  res.send({ result: "success", payload: result });
});

messageRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await messagesModel.deleteOne({ _id: id });
  res.send({ result: "success", payload: result });
});

export default messageRouter;
