import mongoose from "mongoose";
import { EXPENSE_TAGS } from "../config/constants/expenseTags";

const { Schema } = mongoose;

const expenseSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
      enum: EXPENSE_TAGS,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

expenseSchema.index({ user: 1, date: -1 });

const Expense = mongoose.model("Expenses", expenseSchema);

export default Expense;
