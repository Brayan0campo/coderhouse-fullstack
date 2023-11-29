import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import config from "./config/config.js";
import usersRouter from "./routes/users.router.js";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";

// Express
const PORT = config.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Session Mongo
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.MONGO_URL,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 3600,
    }),
    secret: config.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

// Mongoose
mongoose
  .connect(config.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
    app.listen(PORT, () => {
      console.log(`Express server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database, error: ", error);
  });