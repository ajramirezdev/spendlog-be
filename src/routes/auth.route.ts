import express, { Router } from "express";
import passport from "passport";
import { login, logout, signup } from "../controller/auth.controller";
import validateUser from "../validator/user.validator";

import "../auth/local-strategy";

const router: Router = express.Router();

router.post("/login", passport.authenticate("local"), login);
router.post("/logout", logout);
router.post("/signup", validateUser, signup);

export default router;
