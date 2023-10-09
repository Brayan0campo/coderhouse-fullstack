import * as path from "path";
import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import __dirname from "./ultils.js";
import { engine } from "express-handlebars";
import cartRouter from "./router/cart.routes.js";
import prodRouter from "./router/product.routes.js";
import CartManager from "./controllers/CartManager.js";
import ProductManager from "./controllers/ProductManager.js";

// Express
const PORT = 8080;
const app = express();
const cart = new CartManager();
const product = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/carts", cartRouter);
app.use("/api/products", prodRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor express corriendo en ${PORT}`);
});

// Mongoose
mongoose
  .connect(
    "mongodb+srv://pruebaCoder:nho3lhDUHKYOwGnX@cluster0.4odjfny.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Conectado correctamente a la base de datos");
  })
  .catch((error) => {
    console.error("Error al conectarse a la base de datos, error" + error);
  });

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));
app.use("/", express.static(__dirname + "/public"));

app.get("/products", async (req, res) => {
  let allProducts = await product.getProducts();
  allProducts = allProducts.map((product) => product.toJSON());
  res.render("viewProducts", {
    title: "Seccion de Productos",
    products: allProducts,
  });
});

app.get("/carts/:cid", async (req, res) => {
  let id = req.params.cid;
  let allCarts = await cart.getCartWithProducts(id);
  res.render("viewCart", {
    title: "Seccion de Carritos",
    carts: allCarts,
  });
});
