import mongoose from "mongoose";
import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";

import {
  buildAggregation,
  calculateDifference,
  expensesOverview,
} from "../utils/expense.helpers";

import Expense from "../models/expense.model";

import { PaginationRequest } from "../types/requestTypes";
import { ExpensePeriod } from "../types/expenses";

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

export const editExpense = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const validatedData = matchedData(req);

    const expenseId = req.params.id;
    const userId = req.user?.id;

    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      { $set: { ...validatedData, user: userId } },
      { new: true }
    );

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: "Failed to update expense." });
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

export const getUserExpensesByPeriod = async (req: Request, res: Response) => {
  try {
    const period = req.params.period;
    const aggregationPipeline = buildAggregation(period as ExpensePeriod);

    const expenses = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user?.id) } },
      ...aggregationPipeline,
    ]);

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Failed to get user expenses." });
  }
};

export const getExpenseSummary = async (req: Request, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user?.id);
    const [results] = await Expense.aggregate(expensesOverview(userId));

    res.json({
      totalExpenses: results.totalExpenses[0]?.total || 0,
      monthlyExpenses: {
        amount: results.monthlyExpenses[0]?.total || 0,
        ...calculateDifference(
          results.monthlyExpenses[0]?.total || 0,
          results.lastMonthExpenses[0]?.total || 0
        ),
      },
      weeklyExpenses: {
        amount: results.weeklyExpenses[0]?.total || 0,
        ...calculateDifference(
          results.weeklyExpenses[0]?.total || 0,
          results.lastWeekExpenses[0]?.total || 0
        ),
      },
      dailyExpenses: {
        amount: results.dailyExpenses[0]?.total || 0,
        ...calculateDifference(
          results.dailyExpenses[0]?.total || 0,
          results.yesterdayExpenses[0]?.total || 0
        ),
      },
    });
  } catch (error) {
    res.sendStatus(500);
  }
};
