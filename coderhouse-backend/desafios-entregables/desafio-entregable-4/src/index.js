import * as path from "path";
import express from "express";
import { Server } from "socket.io";
import __dirname from "./ultils.js";
import { engine } from "express-handlebars";
import cartRouter from "./router/cart.routes.js";
import prodRouter from "./router/product.routes.js";
import ProductManager from "./controllers/ProductManager.js";

// Express
const app = express();
const PORT = 8080;
const product = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor express corriendo en ${PORT}`);
});

// Socket.io
const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log("Nuevo Cliente Conectado");
  socket.on("message", (data) => {
    console.log(data);
  });

  socket.on("newProd", (newProduct) => {
    product.addProduct(newProduct);
    socketServer.emit("success", "Producto Agregado Correctamente");
  });
});

// Handlebars
app.engine("handlebars", engine());

app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

app.use("/", express.static(__dirname + "/public"));
app.use("/realTimeProducts", prodRouter);

app.get("/", async (req, res) => {
  let allProducts = await product.getProduct();
  res.render("home", {
    title: "Handlebars",
    products: allProducts,
  });
});
