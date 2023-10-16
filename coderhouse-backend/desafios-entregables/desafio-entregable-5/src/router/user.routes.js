import { Router } from "express";
import UserManager from "../controllers/UserManager.js";

const userRouter = Router();
const userManager = new UserManager();

userRouter.get("/logout", async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.json({ status: "Logout Error", body: error });
    }
    res.redirect("../../login");
  });
});

userRouter.post("/register", (req, res) => {
  try {
    let newUser = req.body;
    userManager.createUser(newUser);
    res.redirect("/login");
  } catch (error) {
    res.status(500).send("Error registering user: " + error.message);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    let email = req.body.email;
    const data = await userManager.validateUser(email);
    if (data.password === req.body.password) {
      if (data.role === "admin") {
        req.session.emailUser = email;
        req.session.firstName = data.firstName;
        req.session.lastName = data.lastName;
        req.session.roleUser = data.user;
        res.redirect("/profile");
      } else {
        req.session.emailUser = email;
        req.session.roleUser = data.user;
        res.redirect("/products");
      }
    } else {
      res.redirect("../../login");
    }
  } catch (error) {
    res.status(500).send("Error logging in: " + error.message);
  }
});

export default userRouter;
