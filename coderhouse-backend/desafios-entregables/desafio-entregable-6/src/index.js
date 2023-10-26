import * as path from "path";
import express from "express";
import mongoose from "mongoose";
import __dirname from "./ultils.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import FileStore from "session-file-store";
import { engine } from "express-handlebars";
import cartRouter from "./router/cart.routes.js";
import userRouter from "./router/user.routes.js";
import prodRouter from "./router/product.routes.js";
import CartManager from "./controllers/CartManager.js";
import ProductManager from "./controllers/ProductManager.js";

// Express
const PORT = 8080;
const app = express();
const fileStorage = FileStore(session);
const productManager = new ProductManager();
const cartManager = new CartManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

// Mongoose
mongoose
  .connect(
    "mongodb+srv://pruebaCoder:nho3lhDUHKYOwGnX@cluster0.4odjfny.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database, error" + error);
  });

// Session Mongo
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://pruebaCoder:nho3lhDUHKYOwGnX@cluster0.4odjfny.mongodb.net/?retryWrites=true&w=majority",
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 3600,
    }),
    secret: "SecretKey",
    resave: false,
    saveUninitialized: false,
  })
);

// Routes
app.use("/api/carts", cartRouter);
app.use("/api/products", prodRouter);
app.use("/api/sessions", userRouter);

// Handlebars
app.engine("handlebars", engine());

app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

app.use("/", express.static(__dirname + "/public"));

app.get("/products", async (req, res) => {
  if (!req.session.emailUser) {
    return res.redirect("/login");
  }
  let products = await productManager.getProducts();
  products = products.map((product) => product.toJSON());
  res.render("viewProducts", {
    title: "Products",
    products: products,
    email: req.session.emailUser,
    role: req.session.roleUser,
  });
});

app.get("/carts/:cid", async (req, res) => {
  let id = req.params.cid;
  let carts = await cartManager.getCartWithProducts(id);
  res.render("viewCart", {
    title: "Carts",
    carts: carts,
  });
});

app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
  });
});

app.get("/register", (req, res) => {
  res.render("register", {
    title: "Register",
  });
});

app.get("/profile", (req, res) => {
  if (!req.session.emailUser) {
    return res.redirect("/login");
  }
  res.render("profile", {
    title: "Profile",
    firstName: req.session.firstName,
    lastName: req.session.lastName,
    email: req.session.emailUser,
    role: req.session.roleUser,
  });
});
