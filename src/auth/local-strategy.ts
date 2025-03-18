import passport from "passport";
import { Strategy } from "passport-local";
import { verifyPassword } from "../utils/helpers";

import User from "../models/user.model";

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser(async (_id, done) => {
  try {
    const user = await User.findOne({ _id });
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

export default passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: "User not found" });
      }
      if (!user.password || !verifyPassword(password, user.password)) {
        return done(null, false, { message: "Wrong Password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);
