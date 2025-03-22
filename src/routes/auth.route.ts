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

router.post("/logout", authenticateUser, logout);

export default router;
