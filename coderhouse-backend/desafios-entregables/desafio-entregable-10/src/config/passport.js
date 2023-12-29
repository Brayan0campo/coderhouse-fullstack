import passport from "passport";
import passportJWT from "passport-jwt";

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};

const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "secret-key",
      },
      async (token, done) => {
        try {
          return done(null, token);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initializePassport;
