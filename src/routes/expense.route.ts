import express, { Router } from "express";

import {
  authenticateUser,
  authorizeUserByExpense,
  authorizeUserById,
  paginate,
} from "../utils/helpers";
import {
  createExpense,
  deleteExpense,
  getUserExpenses,
} from "../controllers/expense.controller";
import validateExpense from "../validators/expense.validator";

const router: Router = express.Router();

router.post("/", authenticateUser, validateExpense, createExpense);
router.delete("/:id", authenticateUser, authorizeUserByExpense, deleteExpense);
router.get(
  "/user/:id",
  authenticateUser,
  authorizeUserById,
  paginate,
  getUserExpenses
);

export default router;
