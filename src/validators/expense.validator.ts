import { checkSchema } from "express-validator";
import { EXPENSE_TAGS } from "../config/constants/expenseTags";

const expenseValidatorSchema = {
  amount: {
    trim: true,
    notEmpty: {
      errorMessage: "Amount cannot be empty.",
    },
    isFloat: {
      options: { gt: 0 },
      errorMessage: "Amount must be a valid number greater than zero.",
    },
  },
  tags: {
    isArray: {
      errorMessage: "Tags must be an array.",
    },
    custom: {
      options: (tags: string[]) =>
        tags.length > 0 && tags.every((tag) => EXPENSE_TAGS.includes(tag)),
      errorMessage: "Invalid tag value.",
    },
  },
  date: {
    notEmpty: {
      errorMessage: "Date is required.",
    },
    isISO8601: {
      errorMessage: "Date must be a valid ISO8601 format.",
    },
    toDate: true,
  },
  description: {
    optional: true,
    trim: true,
    isString: {
      errorMessage: "Description must be a string.",
    },
  },
};

const validateExpense = checkSchema(expenseValidatorSchema);

export default validateExpense;
