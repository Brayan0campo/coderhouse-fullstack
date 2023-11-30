import * as path from "path";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import { Server } from "socket.io";
import config from "./config/config.js";
import cookieParser from "cookie-parser";
import { engine } from "express-handlebars";
import UserDTO from "./dao/DTOs/user.dto.js";
import { signToken } from "./jwt/sign.token.js";
import cartsRouter from "./routes/carts.router.js";
import usersRouter from "./routes/users.router.js";
import ticketsRouter from "./routes/tickets.router.js";
import productsRouter from "./routes/products.router.js";
import UsersMongo from "./dao/mongo/users.mongo.js";
import ProductsMongo from "./dao/mongo/products.mongo.js";
import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt as ExtractJwt } from "passport-jwt";
import initializePassport from "./config/passport.js";
import __dirname, { roleAuth, passportAuth, transporter } from "./utils.js";

// Express
const PORT = config.PORT;
const app = express();
const usersMongo = new UsersMongo();
const productsMongo = new ProductsMongo();

// Mongoose
mongoose
  .connect(config.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database, error: ", error);
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

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.resolve(__dirname + "/views"));
app.set("view engine", "handlebars");
app.engine("handlebars", engine());

initializePassport();
app.use(passport.initialize());

const server = app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

// Socket.io
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("message", (data) => {
    console.log(data);
  });

  socket.on("newProd", (newProduct) => {
    products.createProduct(newProduct);
    io.emit("success", "Product created successfully");
  });

  socket.on("updProd", (id, updProduct) => {
    products.updateProduct(id, updProduct);
    io.emit("success", "Product updated successfully");
  });

  socket.on("delProd", (id) => {
    products.deleteProduct(id);
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

// Routes
app.use("/carts", cartsRouter);
app.use("/users", usersRouter);
app.use("/tickets", ticketsRouter);
app.use("/products", productsRouter);

// Handlebars
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: app.get("views") });
});

app.get(
  "/current",
  passportAuth("jwt", { session: false }),
  roleAuth("user"),
  (req, res) => {
    roleAuth("user")(req, res, async () => {
      const allProducts = await productsMongo.get();
      res.render("home", { products: allProducts });
    });
  }
);

app.get("/admin", passportAuth("jwt"), roleAuth("user"), (req, res) => {
  roleAuth("user")(req, res, async () => {
    const allProducts = await productsMongo.get();
    res.render("admin", { products: allProducts });
  });
});

app.post("/login", async (req, res) => {
  const emailFound = email;
  const { email, password } = req.body;
  const user = await usersMongo.findByEmail({ email: emailFound });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Incorrect email or password." });
  }

  const token = signToken(res, email, password);
  const userDTO = new UserDTO(user);
  const allProducts = await productsMongo.get();
  res.json({ token, user: userDTO, allProducts });
});

app.get("/register", (req, res) => {
  res.sendFile("register.html", { root: app.get("views") });
});

app.post("/api/register", async (req, res) => {
  const emailFound = email;
  const { firstName, lastName, email, age, password, role } = req.body;
  const user = await usersMongo.findByEmail({ email: emailFound });

  if (user) return res.status(400).send({ message: "Email already exists." });

  const newUser = {
    firstName,
    lastName,
    email,
    age,
    password,
    role,
  };

  usersMongo.createUser(newUser);
  const token = signToken(res, email, password);
  res.send({ token });
});
