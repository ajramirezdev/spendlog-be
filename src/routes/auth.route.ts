import express, { Router } from "express";
import passport from "../config/passport/index";
import {
  login,
  logout,
  signup,
  getCurrentUser,
  redirectToHomepage,
} from "../controllers/auth.controller";
import validateUser from "../validators/user.validator";
import { authenticateUser } from "../middlewares/auth.middleware";

import "../auth/local-strategy";
import "../auth/google-strategy";
import "../auth/discord-strategy";
import "../auth/github-strategy";

const router: Router = express.Router();

router.post("/login", passport.authenticate("local"), authenticateUser, login);
router.post("/signup", validateUser, signup);
router.get("/me", authenticateUser, getCurrentUser);

router.get("/google", passport.authenticate("google"));
router.get(
  "/google/callback",
  passport.authenticate("google"),
  authenticateUser,
  redirectToHomepage
);

router.get("/discord", passport.authenticate("discord"));
router.get(
  "/discord/callback",
  passport.authenticate("discord"),
  authenticateUser,
  redirectToHomepage
);

router.get("/github", passport.authenticate("github"));
router.get(
  "/github/callback",
  passport.authenticate("github", { failureMessage: true }),
  authenticateUser,
  redirectToHomepage
);

router.post("/logout", authenticateUser, logout);

export default router;
