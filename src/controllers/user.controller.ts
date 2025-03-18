import { Request, Response } from "express";
import Expense from "../models/expense.model";
import { PaginationRequest } from "../types/requestTypes";

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
