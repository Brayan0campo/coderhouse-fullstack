import express from "express";
import {
  getCartById,
  createCart,
  updateCart,
  deleteCart,
} from "../controllers/carts.controller.js";

const router = express.Router();

router.get("/:cartId", getCartById);
router.post("/", createCart);
router.put("/:cartId", updateCart);
router.delete("/:cartId", deleteCart);

export default router;
