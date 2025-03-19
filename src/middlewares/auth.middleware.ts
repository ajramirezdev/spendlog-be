import { Request, Response, NextFunction } from "express";
import Expense from "../models/expense.model";

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated()) {
    res.sendStatus(401);
    return;
  }
  next();
};

export const authorizeUserById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.params.id && req.user?.id !== req.params.id) {
    res.sendStatus(403);
    return;
  }
  next();
};

export const authorizeUserByExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const expenseId = req.params.id;
    const userId = req.user?.id;

    if (!expenseId) {
      res.status(400).json({ message: "Expense ID is required." });
      return;
    }

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      res.status(404).json({ message: "Expense not found." });
      return;
    }

    if (expense.user.toString() !== userId) {
      res.sendStatus(403);
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Authorization failed." });
  }
};
