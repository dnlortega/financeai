import { Transaction, TransactionCategory, TransactionType } from "@prisma/client";

export type TransactionWithNumberAmount = Omit<Transaction, "amount"> & {
  amount: number;
};

export type TransactionPercentagePerType = {
  [key in TransactionType]: number;
};

export interface TotalExpensePerCategory {
  category: TransactionCategory;
  totalAmount: number;
  percentageOfTotal: number;
}
