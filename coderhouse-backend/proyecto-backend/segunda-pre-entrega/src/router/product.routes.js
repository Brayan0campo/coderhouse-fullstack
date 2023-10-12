import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";

const productRouter = Router();
const productManager = new ProductManager();

productRouter.get("/", async (req, res) => {
  const sort = req.query.sort;
  const category = req.query.category;
  const available = req.query.available;

  if (sort === undefined) {
    sort = "asc";
  }

  if (category === undefined) {
    category = "";
  }

  if (available === undefined) {
    available = "";
  }

  res.send(
    await productManager.getProductsAll(null, null, sort, category, available)
  );
});

productRouter.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const productDetails = await productManager.getProductById(productId);
    res.render("viewDetails", { product: productDetails });
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).json({ error: "Error getting product" });
  }
});

productRouter.get("/limit/:limit", async (req, res) => {
  const limit = parseInt(req.params.limit);
  if (isNaN(limit) || limit <= 0) {
    limit = 10;
  }
  res.send(await productManager.getProductsByLimit(limit));
});

productRouter.get("/page/:page", async (req, res) => {
  const page = parseInt(req.params.page);
  if (isNaN(page) || page <= 0) {
    page = 1;
  }
  const productsByPage = 1;
  res.send(await productManager.getProductsByPage(page, productsByPage));
});

productRouter.get("/find/query", async (req, res) => {
  const query = req.query.q;
  res.send(await productManager.getProductsByQuery(query));
});

productRouter.get("/order/sort", async (req, res) => {
  const order = 0;
  if (req.query.sort) {
    if (req.query.sort === "desc") {
      order = -1;
    } else if (req.query.sort === "asc") {
      order = 1;
    }
  }
  res.send(await productManager.getProductsBySort(order));
});

productRouter.post("/", async (req, res) => {
  const newProduct = req.body;
  res.send(await productManager.addProduct(newProduct));
});

productRouter.put("/:id", async (req, res) => {
  const productId = req.params.id;
  const updateProduct = req.body;
  res.send(await productManager.updateProduct(productId, updateProduct));
});

productRouter.delete("/:id", async (req, res) => {
  const productId = req.params.id;
  res.send(await productManager.deleteProduct(productId));
});

export default productRouter;
