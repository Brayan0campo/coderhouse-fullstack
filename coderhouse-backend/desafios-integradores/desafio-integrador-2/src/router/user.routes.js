import passport from "passport";
import { Router } from "express";
import UserManager from "../controllers/UserManager.js";

const userRouter = Router();
const userManager = new UserManager();

userRouter.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  async (req, res) => {
    try {
      const { firstName, lastName, email, age, password, role } = req.body;
      if (!firstName || !lastName || !email || !age || !password || !role) {
        return res.status(400).send("Missing Required Fields");
      }
      res.redirect("/login");
    } catch (error) {
      res.status(500).send("Error Registering User: " + error.message);
    }
  }
);

userRouter.get("/failregister", async (req, res) => {
  res.send(error, "Error Registering User");
});

userRouter.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res
          .status(400)
          .send({ status: "Login Error", error: "Invalid Credentials" });
      }

      if (req.user.role === "admin") {
        req.session.emailUser = req.user.email;
        req.session.firstName = req.user.firstName;
        req.session.lastName = req.user.lastName;
        req.session.roleUser = req.user.role;
        res.redirect("/profile");
      } else {
        req.session.emailUser = req.user.email;
        req.session.roleUser = req.user.role;
        res.redirect("/products");
      }
    } catch (error) {
      res.status(500).send("Error logging in: " + error.message);
    }
  }
);

userRouter.get("/faillogin", async (req, res) => {
  res.send(error, "Error logging in");
});

userRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

userRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.emailUser = req.session.user.email;
    req.session.roleUser = req.session.user.role;
    res.redirect("/products");
  }
);

userRouter.get("/logout", async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.json({ status: "Logout Error", body: error });
    }
    res.redirect("../../login");
  });
});

export default userRouter;
