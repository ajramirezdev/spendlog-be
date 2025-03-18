import express, { Router } from "express";

import { authenticateUser } from "../utils/helpers";
import { createExpense } from "../controllers/expense.controller";
import validateExpense from "../validators/expense.validator";

const router: Router = express.Router();

router.post("/", authenticateUser, validateExpense, createExpense);

export default router;
