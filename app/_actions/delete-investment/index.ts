"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const deleteInvestment = async (investmentId: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await db.investment.delete({
    where: {
      id: investmentId,
      userId,
    },
  });

  revalidatePath("/investments");
  revalidatePath("/");
};
