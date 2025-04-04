import dotenv from "dotenv";
dotenv.config();

import passport from "../config/passport/index";
import { Strategy } from "passport-discord";

import User from "../models/user.model";

export default passport.use(
  new Strategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
      callbackURL: process.env.DISCORD_CALLBACK_URL ?? "",
      scope: ["identify", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, avatar, username, global_name, email, provider } = profile;

        const avatarUrl = avatar
          ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/${parseInt(id) % 5}.png`;

        let user = await User.findOne({ email });

        if (!user) {
          user = new User({
            firstName: username,
            lastName: global_name,
            email,
            provider,
            image: avatarUrl,
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
