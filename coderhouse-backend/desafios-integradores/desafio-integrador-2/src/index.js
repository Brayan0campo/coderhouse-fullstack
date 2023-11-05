import * as path from "path";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import { signToken } from "./jwt/SignToken.js";
import UserManager from "./controllers/UserManager.js";
import CartManager from "./controllers/CartManager.js";
import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt as ExtractJwt } from "passport-jwt";
import __dirname, { roleAuth, passportAuth } from "./utils.js";
import initializePassport from "./config/passport.config.js";

// Express
const PORT = 8080;
const app = express();
const userManager = new UserManager();
const cartManager = new CartManager();

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
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

// Passport
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "SecretKey",
};

passport.use(
  new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    const user = userManager.findUser(
      (user) => user.email === jwtPayload.email
    );
    if (!user) {
      return done(null, false, { message: "User not found" });
    }
    return done(null, user);
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: app.get("views") });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const findEmail = email;
  const user = await userManager.findEmail({ email: findEmail });

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signToken(res, email, password);
  res.json({ token, user: { email: user.email, role: user.role } });
});

app.get("/register", (req, res) => {
  res.sendFile("register.html", { root: app.get("views") });
});

app.post("/api/register", async (req, res) => {
  const { firstName, lastName, email, age, password, role } = req.body;
  const findEmail = email;
  const user = await userManager.findEmail({ email: findEmail });

  if (user) {
    return res.status(400).json({ error: "User already exists" });
  }

  const newUser = {
    firstName,
    lastName,
    email,
    age,
    password,
    role,
    cart: cartManager.addCart(),
  };
  userManager.createUser(newUser);
  const token = signToken(res, email, password);
  res.send({ token });
});

app.get("/current", passportAuth("jwt"), roleAuth("user"), (req, res) => {
  res.sendFile("landing.html", { root: app.get("views") });
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
