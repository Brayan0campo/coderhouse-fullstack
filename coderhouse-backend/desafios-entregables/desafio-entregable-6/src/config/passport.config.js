import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import UserManager from "../controllers/UserManager.js";
import { hashPassword, validatePassword } from "../ultils.js";

const LocalStrategy = local.Strategy;
const userManager = new UserManager();

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { firstName, lastName, email, role } = req.body;
        try {
          let user = await userManager.findEmail({ email: username });
          if (user) {
            console.log("User already exists");
            return done(null, false);
          }
          const hash = await hashPassword(password);
          const newUser = {
            firstName,
            lastName,
            email,
            password: hash,
            role,
          };
          let create = await userManager.createUser(newUser);
          return done(null, create);
        } catch (error) {
          return done("Error creating user" + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userManager.findEmail({ email: username });
          if (!user) {
            console.log("User not found");
            return done(null, false);
          }
          if (!validatePassword(user, password)) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done("Error validating user" + error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "",
        clientSecret: "",
        callbackURL: "",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userManager.findEmail({
            email: profile._json.email,
          });
          if (!user) {
            let newUser = {
              firstName: profile._json.name,
              lastName: "github",
              email: profile._json.email,
              password: "",
              role: "user",
            };
            let create = await userManager.createUser(newUser);
            return done(null, create);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done("Error validating user" + error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userManager.getUserById(id);
    done(null, user);
  });
};

export default initializePassport;
