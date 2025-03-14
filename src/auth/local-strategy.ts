import passport from "passport";
import { Strategy } from "passport-local";
import User from "../model/user.model";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (_id, done) => {
  try {
    const user = await User.findOne({ _id });
    if (!user) throw new Error("User not found.");
    done(null, user);
  } catch (error) {
    done(error, undefined);
  }
});

export default passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found.");
      if (password !== user.password) throw new Error("Wrong Password.");
      done(null, user);
    } catch (error) {
      done(error, undefined);
    }
  })
);
