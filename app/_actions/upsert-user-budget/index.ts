import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { TransactionCategory } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface UpsertUserBudgetParams {
  category: TransactionCategory;
  amount: number;
}

export const upsertUserBudget = async (params: UpsertUserBudgetParams) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await db.userBudget.upsert({
    where: {
      userId_category: {
        userId,
        category: params.category,
      },
    },
    update: {
      amount: params.amount,
    },
    create: {
      userId,
      category: params.category,
      amount: params.amount,
    },
  });

  revalidatePath("/");
};
