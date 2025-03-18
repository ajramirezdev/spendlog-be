import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

import { PaginationRequest } from "../types/requestTypes";
import Expense from "../models/expense.model";

const saltRounds = 10;

export const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

export const verifyPassword = (plain: string, hashed: string) => {
  return bcrypt.compareSync(plain, hashed);
};

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

export const paginate = (
  req: PaginationRequest,
  res: Response,
  next: NextFunction
) => {
  let page = parseInt(req.query.page as string) || 1;
  let limit = parseInt(req.query.limit as string) || 10;

  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  const skip = (page - 1) * limit;

  req.pagination = { page, limit, skip };
  next();
};
