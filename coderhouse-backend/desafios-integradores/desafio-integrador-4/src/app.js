import * as path from "path";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import { Server } from "socket.io";
import { logger } from "./logger.js";
import bodyParser from "body-parser";
import { faker, tr } from "@faker-js/faker";
import config from "./config/config.js";
import swaggerJSDoc from "swagger-jsdoc";
import cookieParser from "cookie-parser";
import { engine } from "express-handlebars";
import UserDTO from "./dao/DTOs/users.dto.js";
import compression from "express-compression";
import swaggerUIExpress from "swagger-ui-express";
import cartsRouter from "./routes/carts.router.js";
import usersRouter from "./routes/users.router.js";
import UsersMongo from "./dao/mongo/users.mongo.js";
import initializePassport from "./config/passport.js";
import { Strategy as JwtStrategy } from "passport-jwt";
import ticketsRouter from "./routes/tickets.router.js";
import { ExtractJwt as ExtractJwt } from "passport-jwt";
import productsRouter from "./routes/products.router.js";
import ProductsMongo from "./dao/mongo/products.mongo.js";
import __dirname, { roleAuth, passportAuth, transporter } from "./utils.js";
import {
  signToken,
  generateResetToken,
  emailTokenLogin,
  verifyResetToken,
  validatePassword,
} from "./jwt/pass.token.js";

// Express
const app = express();
const PORT = config.PORT;
const usersMongo = new UsersMongo();
const productsMongo = new ProductsMongo();

// Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API Documentation for the e-commerce project",
    },
  },
  apis: [`src/docs/products.yaml`, `src/docs/carts.yaml`],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use(
  "/api-docs",
  swaggerUIExpress.serve,
  swaggerUIExpress.setup(swaggerDocs)
);

// Mongoose
mongoose
  .connect(config.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Successfully connected to the database");
  })
  .catch((error) => {
    logger.error("Error connecting to the database: " + error.message);
  });

// Passport
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.SECRET_KEY,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await usersMongo.findByJWT(
        (user) => user.email === payload.email
      );
      if (!user) {
        return done(null, false, { message: "Incorrect email." });
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.resolve(__dirname + "/views"));
app.set("view engine", "handlebars");
app.engine("handlebars", engine());

initializePassport();
app.use(passport.initialize());
app.use(logger);

const server = app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});

// Socket.io
const io = new Server(server);

io.on("connection", (socket) => {
  logger.info("New user connected");
  socket.on("message", (data) => {
    logger.info(data);
  });

  socket.on("newProd", (newProduct) => {
    let validateUser = usersMongo.getUserRole(newProduct.owner);
    if (validateUser === "premium") {
      productsMongo.createProduct(newProduct);
      io.emit("success", "Product created successfully");
    } else {
      io.emit("error", "You are not an premium user");
    }
  });

  socket.on("updProd", (id, updProduct) => {
    productsMongo.updateProduct(id, updProduct);
    io.emit("success", "Product updated successfully");
  });

  socket.on("delProd", (id) => {
    productsMongo.deleteProduct(id);
    io.emit("success", "Product deleted successfully");
  });

  socket.on("newEmail", async ({ email, message }) => {
    const sendEmail = await transporter.sendMail({
      from: "ocamporodriguezbrayan@gmail.com",
      to: email,
      subject: "New email",
      html: `<h1>${message}</h1>`,
    });
    io.emit("success", "Email sent successfully");
  });
});

// Routes Backend
app.use("/carts", cartsRouter);
app.use("/users", usersRouter);
app.use("/tickets", ticketsRouter);
app.use("/products", productsRouter);

// Routes Frontend
app.get("/", (req, res) => {
  logger.info("User connected to the home page.");
  res.sendFile("index.html", { root: app.get("views") });
});

app.get(
  "/current",
  passportAuth("jwt", { session: false }),
  roleAuth("user"),
  (req, res) => {
    logger.info("User connected to the current page.");
    roleAuth("user")(req, res, async () => {
      const userData = { email: req.user.email };
      const allProducts = await productsMongo.get();
      res.render("userHome", { products: allProducts, user: userData });
    });
  }
);

app.get(
  "/current-plus",
  passportAuth("jwt", { session: false }),
  roleAuth("user"),
  (req, res) => {
    req.logger.info("User connected to the current-plus page.");
    roleAuth("user")(req, res, async () => {
      const { token } = req.query;
      const emailToken = emailTokenLogin(token);
      const allProducts = await productsMongo.get();
      res.render("userHome", { products: allProducts, email: emailToken });
    });
  }
);

app.get("/admin", passportAuth("jwt"), roleAuth("admin"), (req, res) => {
  logger.info("User connected to the admin page.");
  roleAuth("admin")(req, res, async () => {
    const allProducts = await productsMongo.get();
    res.render("adminHome", { products: allProducts });
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const emailFound = email;
  const user = await usersMongo.findByEmail({ email: emailFound });

  if (!user || user.password !== password) {
    logger.error("Incorrect email or password.");
    return res.status(401).json({ message: "Incorrect email or password." });
  }

  try {
    const token = signToken(res, email, password);
    const userDTO = new UserDTO(user);
    const allProducts = await productsMongo.get();
    usersMongo.updateLastConnection(email);
    res.json({ token, user: userDTO, allProducts });
    logger.info("User logged successfully.");
  } catch (error) {
    logger.error("Internal server error." + error.message);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.get("/logout", (req, res) => {
  try {
    logger.info("User logged out successfully.");
    let email = req.query.email;
    usersMongo.updateLastConnection(email);
    res.redirect("/");
  } catch (error) {
    logger.error("Internal server error." + error.message);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.get("/forgotPassword", async (req, res) => {
  res.sendFile("forgotPassword.html", { root: __dirname + "/views" });
});
app.get("/resetPassword", (req, res) => {
  res.sendFile("resetPassword.html", { root: __dirname + "/views" });
});

app.get("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  try {
    const user = await usersMongo.findByResetToken(token);
    if (!user || user.resetPasswordExpires < Date.now()) {
      logger.error("Token expired.");
      return res.sendFile("forgotPassword.html", {
        root: __dirname + "/views",
      });
    }

    res.sendFile("resetPassword.html", { root: __dirname + "/views" });
  } catch (error) {
    logger.error("Internal server error." + error.message);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.get("/register", (req, res) => {
  logger.info("User connected to the register page.");
  res.sendFile("register.html", { root: app.get("views") });
});

app.post("/api/register", async (req, res) => {
  const { firstName, lastName, email, age, password, role } = req.body;
  const emailFound = email;
  const user = await usersMongo.findByEmail({ email: emailFound });

  if (user) {
    logger.error("Email already exists.");
    return res.status(400).send({ message: "Email already exists." });
  }

  const newUser = {
    firstName,
    lastName,
    email,
    age,
    password,
    role,
  };

  try {
    usersMongo.createUser(newUser);
    const token = signToken(res, email, password);
    res.send({ token });
    logger.info("User created successfully.");
  } catch (error) {
    logger.error("Internal server error." + error.message);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.get("/mockingproducts", async (req, res) => {
  const productsMongo = [];

  for (let i = 0; i < 100; i++) {
    const product = {
      id: faker.string.uuid(),
      description: faker.commerce.productName(),
      price: faker.number.int({ min: 1, max: 1000 }),
      stock: faker.number.int({ min: 1, max: 100 }),
      category: faker.commerce.department(),
      available: faker.datatype.boolean() ? "in_stock" : "out_of_stock",
    };

    productsMongo.push(product);
  }

  res.json(productsMongo);
});

// Logger test routes
app.get("/loggerTest", (req, res) => {
  logger.debug("Debug message");
  logger.http("HTTP message");
  logger.info("Info message");
  logger.warn("Warning message");
  logger.error("Error message");

  res.send("Logging test complete");
});
