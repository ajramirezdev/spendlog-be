import dotenv from "dotenv";
dotenv.config();

import passport from "../config/passport/index";
import { Strategy } from "passport-github";

import User from "../models/user.model";

export default passport.use(
  new Strategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      callbackURL: process.env.GITHUB_CALLBACK_URL ?? "",
      scope: ["read:user", "user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { displayName, username, emails, photos, provider } = profile;

        if (!emails || emails.length === 0) {
          return done(null, false, {
            message: "Make your email public in your GitHub settings.",
          });
        }

        let user = await User.findOne({ email: emails[0].value });

        if (!user) {
          user = new User({
            firstName: username,
            lastName: displayName,
            email: emails[0].value,
            provider,
            image: photos && photos[0].value ? photos[0].value : null,
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
