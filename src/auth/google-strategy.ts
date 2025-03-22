import dotenv from "dotenv";
dotenv.config();

import passport from "../config/passport/index";
import { Strategy } from "passport-google-oauth20";

import User from "../models/user.model";

export default passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL ?? "",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { given_name, family_name, email } = profile._json;
        let user = await User.findOne({ email });

        if (!user) {
          user = new User({
            firstName: given_name,
            lastName: family_name,
            email,
            provider: "google",
          });
          user = await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
