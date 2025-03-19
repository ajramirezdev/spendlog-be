import { PipelineStage } from "mongoose";
import { ExpensePeriod } from "../types/expenses";

export const buildAggregation = (period: ExpensePeriod): PipelineStage[] => {
  switch (period) {
    case "daily":
      return dailyExpenses;
    case "weekly":
      return weeklyExpenses;
    case "monthly":
      return monthlyExpenses;
    default:
      throw new Error("Invalid period. Use 'day', 'week', or 'month'.");
  }
};

const dailyExpenses: PipelineStage[] = [
  {
    $group: {
      _id: {
        day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
      },
      totalAmount: { $sum: "$amount" },
      expenses: { $push: "$$ROOT" },
    },
  },
  { $sort: { "_id.day": -1 as 1 | -1 } },
];

const weeklyExpenses: PipelineStage[] = [
  {
    $group: {
      _id: {
        year: { $year: "$date" },
        week: { $week: "$date" },
      },
      totalAmount: { $sum: "$amount" },
      expenses: { $push: "$$ROOT" },
    },
  },
  { $sort: { "_id.year": -1 as 1 | -1, "_id.week": -1 as 1 | -1 } },
];

const monthlyExpenses: PipelineStage[] = [
  {
    $group: {
      _id: {
        year: { $year: "$date" },
        month: { $month: "$date" },
      },
      totalAmount: { $sum: "$amount" },
      expenses: { $push: "$$ROOT" },
    },
  },
  { $sort: { "_id.year": -1 as 1 | -1, "_id.month": -1 as 1 | -1 } },
];
