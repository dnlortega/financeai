import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { TransactionCategory } from "@prisma/client";

export interface Budget {
  category: TransactionCategory;
  amount: number;
}

export interface BudgetsData {
  categoryBudgets: Budget[];
  totalBudget: number | null;
}

export const getBudgets = async (): Promise<BudgetsData> => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const [budgets, totalBudget] = await Promise.all([
    db.userBudget.findMany({
      where: {
        userId,
      },
    }),
    db.userTotalBudget.findUnique({
      where: {
        userId,
      },
    }),
  ]);

  return {
    categoryBudgets: budgets.map((b) => ({
      category: b.category,
      amount: Number(b.amount),
    })),
    totalBudget: totalBudget ? Number(totalBudget.amount) : null,
  };
};
