import express from "express";
import ProductsDTO from "../dao/DTOs/products.dto.js";
import Products from "../dao/mongo/products.mongo.js";
import { productsServices } from "../repositories/index.js";
import Errors from "../services/custom-errors/errors.enum.js";
import CustomError from "../services/custom-errors/errors.customs.js";
import * as ErrorMessages from "../services/custom-errors/errors.info.js";

const productsMongo = new Products();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await productsMongo.get();
    res.send({ status: "success", payload: products });
  } catch (error) {
    res.send({ status: "error", payload: error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productsMongo.getProduct(id);
    res.send({ status: "success", payload: product });
  } catch (error) {
    res.send({ status: "error", payload: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { description, category, price, stock, available } = req.body;
    const product = new ProductsDTO(
      description,
      category,
      price,
      stock,
      available
    );
    const createdProduct = await productsServices.createProduct(product);
    res.send({ status: "success", payload: createdProduct });
  } catch (error) {
    if (error.name === "Error" && error.code === Errors.REQUIRED_DATA.code) {
      const errorMessage = ErrorMessages.createProductError(req.body);
      CustomError.createError({
        name: error.name,
        cause: error.cause,
        message: errorMessage,
        code: error.code,
      });
    } else {
      res.send({ status: "error", payload: error });
    }
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, category, price, stock, available } = req.body;
    const product = new ProductsDTO(
      description,
      category,
      price,
      stock,
      available
    );
    const updatedProduct = await productsServices.updateProduct(id, product);
    res.send({ status: "success", payload: updatedProduct });
  } catch (error) {
    if (error.name === "Error" && error.code === Errors.REQUIRED_DATA.code) {
      const errorMessage = ErrorMessages.updateProductError(
        req.params.id,
        req.body
      );
      CustomError.createError({
        name: error.name,
        cause: error.cause,
        message: errorMessage,
        code: error.code,
      });
    } else {
      res.send({ status: "error", payload: error });
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await productsServices.deleteProduct(id);
    res.send({ status: "success", payload: deletedProduct });
  } catch (error) {
    if (error.name === "Error" && error.code === Errors.DATABASE_ERROR.code) {
      const errorMessage = ErrorMessages.deleteProductError(req.params.id);
      CustomError.createError({
        name: error.name,
        cause: error.cause,
        message: errorMessage,
        code: error.code,
      });
    } else {
      res.send({ status: "error", payload: error });
    }
  }
});

export default router;
