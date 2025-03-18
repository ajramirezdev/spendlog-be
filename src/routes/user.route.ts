import express, { Router } from "express";
import { getUserExpenses } from "../controllers/user.controller";
import { authenticateUser, authorizeUser, paginate } from "../utils/helpers";

const router: Router = express.Router();

router.get(
  "/:id/expenses",
  authenticateUser,
  authorizeUser,
  paginate,
  getUserExpenses
);

export default router;
