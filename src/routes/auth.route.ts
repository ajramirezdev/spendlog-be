import express, { Router } from "express";
import passport from "passport";
import {
  getStatus,
  login,
  logout,
  signup,
} from "../controllers/auth.controller";
import validateUser from "../validators/user.validator";

import "../auth/local-strategy";
import "../auth/google-strategy";

const router: Router = express.Router();

router.post("/login", passport.authenticate("local"), login);
router.post("/signup", validateUser, signup);
router.get("/status", getStatus);

router.get("/google", passport.authenticate("google"));
router.get("/google/callback", passport.authenticate("google"), login);

router.post("/logout", logout);

export default router;
