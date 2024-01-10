import express from "express";
import { logger } from "../logger.js";
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
    logger.info("Products retrieved successfully");
    res.send({ status: "success", payload: products });
  } catch (error) {
    logger.error("Error retrieving products");
    res.send({ status: "error", payload: error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productsMongo.getProduct(id);
    logger.info("Product retrieved successfully");
    res.send({ status: "success", payload: product });
  } catch (error) {
    logger.error("Error retrieving product");
    res.send({ status: "error", payload: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { description, category, price, stock, available } = req.body;

    const owner = req.body.owner || "admin";

    const product = new ProductsDTO(
      description,
      category,
      price,
      stock,
      available,
      owner
    );

    const createdProduct = await productsServices.createProduct(product);
    logger.info("Product created successfully");
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
      logger.error("Error creating product");
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

    const userRole = req.user.role;
    const existingProduct = await productsMongo.getProduct(id);

    if (!existingProduct) {
      return res
        .status(404)
        .send({ status: "error", payload: "Product not found" });
    }

    if (
      userRole === "admin" ||
      (userRole === "premium" && existingProduct.owner === req.user.email)
    ) {
      const updatedProduct = await productsServices.updateProduct(id, product);
      logger.info("Product updated successfully");
      res.send({ status: "success", payload: updatedProduct });
    } else {
      logger.error("Unauthorized user for product update");
      res.status(403).send({
        status: "error",
        payload: "Unauthorized user for product update",
      });
    }
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
      logger.error("Error updating product");
      res.send({ status: "error", payload: error });
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const userRole = req.user.role;
    const existingProduct = await productsMongo.getProduct(id);

    if (!existingProduct) {
      return res
        .status(404)
        .send({ status: "error", payload: "Product not found" });
    }

    if (
      userRole === "admin" ||
      (userRole === "premium" && existingProduct.owner === req.user.email)
    ) {
      const deletedProduct = await productsServices.deleteProduct(id);
      logger.info("Product deleted successfully");
      res.send({ status: "success", payload: deletedProduct });
    } else {
      logger.error("Unauthorized user for product deletion");
      res.status(403).send({
        status: "error",
        payload: "Unauthorized user for product deletion",
      });
    }
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
      logger.error("Error deleting product");
      res.send({ status: "error", payload: error });
    }
  }
});

export default router;
