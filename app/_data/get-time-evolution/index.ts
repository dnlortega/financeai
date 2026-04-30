import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { TransactionType } from "@prisma/client";

export interface TimeEvolutionData {
  month: string;
  deposits: number;
  expenses: number;
  investments: number;
}

export const getTimeEvolution = async (year: string): Promise<TimeEvolutionData[]> => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const startDate = new Date(Number(year), 0, 1);
  const endDate = new Date(Number(year), 11, 31, 23, 59, 59, 999);

  const [transactions, investmentsTable] = await Promise.all([
    db.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
    db.investment.findMany({
      where: {
        userId,
        purchaseDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
  ]);

  const months = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];

  const evolution = months.map((month, index) => {
    const monthTransactions = transactions.filter(t => t.date.getMonth() === index);
    const monthInvestmentsTable = investmentsTable.filter(i => i.purchaseDate.getMonth() === index);
    
    return {
      month,
      deposits: monthTransactions
        .filter(t => t.type === TransactionType.DEPOSIT)
        .reduce((acc, t) => acc + Number(t.amount), 0),
      expenses: monthTransactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((acc, t) => acc + Number(t.amount), 0),
      investments: monthTransactions
        .filter(t => t.type === TransactionType.INVESTMENT)
        .reduce((acc, t) => acc + Number(t.amount), 0) +
        monthInvestmentsTable.reduce((acc, i) => acc + Number(i.amount), 0),
    };
  });

  return evolution;
};
