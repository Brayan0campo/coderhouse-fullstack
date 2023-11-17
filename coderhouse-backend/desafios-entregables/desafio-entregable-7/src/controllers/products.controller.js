import Product from "../dao/classes/products.dao.js";

const productService = new Product();

export const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.send({ status: "success", result: products });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await productService.getProductById(productId);
    res.send({ status: "success", result: product });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const productData = req.body;
  try {
    const newProduct = await productService.createProduct(productData);
    res.status(201).send({ status: "success", result: newProduct });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const updatedProductData = req.body;
  try {
    const updatedProduct = await productService.updateProduct(
      productId,
      updatedProductData
    );
    res.send({ status: "success", result: updatedProduct });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const deletedProduct = await productService.deleteProduct(productId);
    res.send({ status: "success", result: deletedProduct });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};
