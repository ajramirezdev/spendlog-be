import express, { Router } from "express";
import { getStatus, login, logout } from "../controller/auth.controller";
import passport from "passport";

import "../auth/local-strategy";

const router: Router = express.Router();

router.post("/login", passport.authenticate("local"), login);
router.post("/logout", logout);
router.get("/status", getStatus);

export default router;
