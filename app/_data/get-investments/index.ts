import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { InvestmentType } from "@prisma/client";

export interface InvestmentAsset {
  id: string;
  name: string;
  type: InvestmentType;
  amount: number;
  purchaseDate: Date;
}

export const getInvestments = async (): Promise<InvestmentAsset[]> => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const investments = await db.investment.findMany({
    where: {
      userId,
    },
    orderBy: {
      purchaseDate: "desc",
    },
  });

  return investments.map((i) => ({
    ...i,
    amount: Number(i.amount),
  }));
};
