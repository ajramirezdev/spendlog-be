import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
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
