import mongoose, { PipelineStage } from "mongoose";
import { ExpensePeriod } from "../types/expenses";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  endOfDay,
  endOfWeek,
  endOfMonth,
  subDays,
  subWeeks,
  subMonths,
} from "date-fns";

const now = new Date();

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
        week: {
          $concat: [
            { $toString: { $year: "$date" } },
            "-W",
            {
              $cond: {
                if: { $lt: [{ $isoWeek: "$date" }, 10] },
                then: { $concat: ["0", { $toString: { $isoWeek: "$date" } }] },
                else: { $toString: { $isoWeek: "$date" } },
              },
            },
          ],
        },
      },
      totalAmount: { $sum: "$amount" },
      expenses: { $push: "$$ROOT" },
    },
  },
  { $sort: { "_id.week": -1 } },
];

const monthlyExpenses: PipelineStage[] = [
  {
    $group: {
      _id: {
        month: {
          $concat: [
            { $toString: { $year: "$date" } },
            "-",
            {
              $cond: {
                if: { $lt: [{ $month: "$date" }, 10] }, // If month is single-digit, pad with 0
                then: { $concat: ["0", { $toString: { $month: "$date" } }] },
                else: { $toString: { $month: "$date" } },
              },
            },
          ],
        },
      },
      totalAmount: { $sum: "$amount" },
      expenses: { $push: "$$ROOT" },
    },
  },
  { $sort: { "_id.month": -1 as 1 | -1 } },
];

const dateRanges = {
  today: { start: startOfDay(now), end: endOfDay(now) },
  yesterday: {
    start: startOfDay(subDays(now, 1)),
    end: endOfDay(subDays(now, 1)),
  },
  thisWeek: { start: startOfWeek(now), end: endOfWeek(now) },
  lastWeek: {
    start: startOfWeek(subWeeks(now, 1)),
    end: endOfWeek(subWeeks(now, 1)),
  },
  thisMonth: { start: startOfMonth(now), end: endOfMonth(now) },
  lastMonth: {
    start: startOfMonth(subMonths(now, 1)),
    end: endOfMonth(subMonths(now, 1)),
  },
};

export const calculateDifference = (current: number, previous: number) => {
  const difference = current - previous;
  const percentage = previous
    ? ((difference / previous) * 100).toFixed(2)
    : "100";
  return { difference, percentage };
};

export const expensesOverview = (userId: mongoose.Types.ObjectId) => [
  { $match: { user: userId } },
  {
    $facet: {
      totalExpenses: [{ $group: { _id: null, total: { $sum: "$amount" } } }],
      monthlyExpenses: [
        {
          $match: {
            date: {
              $gte: dateRanges.thisMonth.start,
              $lte: dateRanges.thisMonth.end,
            },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ],
      lastMonthExpenses: [
        {
          $match: {
            date: {
              $gte: dateRanges.lastMonth.start,
              $lte: dateRanges.lastMonth.end,
            },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ],
      weeklyExpenses: [
        {
          $match: {
            date: {
              $gte: dateRanges.thisWeek.start,
              $lte: dateRanges.thisWeek.end,
            },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ],
      lastWeekExpenses: [
        {
          $match: {
            date: {
              $gte: dateRanges.lastWeek.start,
              $lte: dateRanges.lastWeek.end,
            },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ],
      dailyExpenses: [
        {
          $match: {
            date: {
              $gte: dateRanges.today.start,
              $lte: dateRanges.today.end,
            },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ],
      yesterdayExpenses: [
        {
          $match: {
            date: {
              $gte: dateRanges.yesterday.start,
              $lte: dateRanges.yesterday.end,
            },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ],
    },
  },
];
