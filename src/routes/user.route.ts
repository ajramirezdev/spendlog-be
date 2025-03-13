import express from "express";

import { registerUser, getAllUsers } from "../controller/user.controller";
import validateUser from "../validator/user.validator";

const router = express.Router();

router.get("/", getAllUsers);

router.post("/", validateUser, registerUser);

export default router;
