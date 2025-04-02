import express, { Router } from "express";

import {
  createExpense,
  deleteExpense,
  editExpense,
  getExpenseSummary,
  getUserExpenses,
  getUserExpensesByPeriod,
} from "../controllers/expense.controller";
import {
  authenticateUser,
  authorizeUserByExpense,
  authorizeUserById,
} from "../middlewares/auth.middleware";
import { paginate } from "../middlewares/pagination.middleware";
import validateExpense from "../validators/expense.validator";

const router: Router = express.Router();

router.post("/", authenticateUser, validateExpense, createExpense);
router.delete("/:id", authenticateUser, authorizeUserByExpense, deleteExpense);
router.put(
  "/:id",
  authenticateUser,
  authorizeUserByExpense,
  validateExpense,
  editExpense
);
router.get(
  "/user/:id",
  authenticateUser,
  authorizeUserById,
  paginate,
  getUserExpenses
);
router.get(
  "/user/:id/:period",
  authenticateUser,
  authorizeUserById,
  getUserExpensesByPeriod
);
router.get(
  "/summary/user/:id",
  authenticateUser,
  authorizeUserById,
  getExpenseSummary
);

export default router;
