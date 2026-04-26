import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { TransactionCategory } from "@prisma/client";

export interface UserBudget {
  category: TransactionCategory;
  amount: number;
}

export const getBudgets = async (): Promise<UserBudget[]> => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const budgets = await db.userBudget.findMany({
    where: {
      userId,
    },
  });

  return budgets.map((b) => ({
    category: b.category,
    amount: Number(b.amount),
  }));
};
