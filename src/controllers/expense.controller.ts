import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";

import { PaginationRequest } from "../types/requestTypes";
import Expense from "../models/expense.model";

export const createExpense = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const validatedData = matchedData(req);
    const userId = req.user?.id;

    const newExpense = new Expense({
      ...validatedData,
      user: userId,
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: "Expense creation failed." });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const expenseId = req.params.id;
    await Expense.deleteOne({ _id: expenseId });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete expense." });
  }
};

export const getUserExpenses = async (
  req: PaginationRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { page, limit, skip } = req.pagination || {
      page: 1,
      limit: 10,
      skip: 0,
    };

    const expenses = await Expense.find({ user: userId })
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 });

    const totalCount = await Expense.countDocuments({ user: userId });
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      expenses,
      totalCount,
      totalPages,
      currentPage: page,
      perPage: limit,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get user expenses." });
  }
};
