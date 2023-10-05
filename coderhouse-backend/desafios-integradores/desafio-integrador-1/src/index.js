import * as path from "path";
import express from "express";
import mongoose from "mongoose";
import __dirname from "./ultils.js";
import { engine } from "express-handlebars";
import cartRouter from "./router/carts.routes.js";
import productRouter from "./router/products.routes.js";
import messageRouter from "./router/messages.routes.js";

// Express
const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Routers
app.use("/api/carts", cartRouter);
app.use("/api/messages", messageRouter);
app.use("/api/products", productRouter);

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));
app.use("/", express.static(__dirname + "/public"));

app.get("/chat", async (req, res) => {
  res.render("chat", {
    title: "Chat Implementado con Mongoose",
  });
});
