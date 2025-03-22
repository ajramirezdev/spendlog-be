import passport from "../config/passport/index";
import { Strategy } from "passport-local";
import { verifyPassword } from "../utils/auth.helpers";

import User from "../models/user.model";

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
