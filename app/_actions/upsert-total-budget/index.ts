"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const upsertTotalBudget = async (amount: number) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await db.userTotalBudget.upsert({
    where: {
      userId,
    },
    update: {
      amount,
    },
    create: {
      userId,
      amount,
    },
  });

  revalidatePath("/");
  revalidatePath("/budgets");
};
