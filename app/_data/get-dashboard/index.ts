import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";
import { TotalExpensePerCategory, TransactionPercentagePerType } from "./types";
import { auth } from "@clerk/nextjs/server";

export const getDashboard = async (month: string, year: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  // Usa o primeiro dia do mês na timezone local para evitar problemas de UTC
  const startDate = new Date(Number(year), Number(month) - 1, 1);
  const endDate = new Date(Number(year), Number(month), 0); // Último dia do mês
  
  const where = {
    userId,
    date: {
      gte: startDate,
      lte: endDate,
    },
  };
  const [
    depositsTotalAggregate,
    investmentsTotalAggregate,
    expensesTotalAggregate,
    investmentsTableAggregate,
  ] = await Promise.all([
    db.transaction.aggregate({
      where: { ...where, type: "DEPOSIT" },
      _sum: { amount: true },
    }),
    db.transaction.aggregate({
      where: { ...where, type: "INVESTMENT" },
      _sum: { amount: true },
    }),
    db.transaction.aggregate({
      where: { ...where, type: "EXPENSE" },
      _sum: { amount: true },
    }),
    db.investment.aggregate({
      where: {
        userId,
        purchaseDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: { amount: true },
    }),
  ]);

  const depositsTotal = Number(depositsTotalAggregate._sum?.amount || 0);
  const investmentsTotal = 
    Number(investmentsTotalAggregate._sum?.amount || 0) + 
    Number(investmentsTableAggregate._sum?.amount || 0);
  const expensesTotal = Number(expensesTotalAggregate._sum?.amount || 0);
  const balance = depositsTotal + investmentsTotal - expensesTotal;
  const transactionsTotal = Number(
    (
      await db.transaction.aggregate({
        where,
        _sum: { amount: true },
      })
    )._sum.amount,
  );
  const typesPercentage: TransactionPercentagePerType = {
    [TransactionType.DEPOSIT]: transactionsTotal > 0 ? Math.round(
      (Number(depositsTotal || 0) / Number(transactionsTotal)) * 100,
    ) : 0,
    [TransactionType.EXPENSE]: transactionsTotal > 0 ? Math.round(
      (Number(expensesTotal || 0) / Number(transactionsTotal)) * 100,
    ) : 0,
    [TransactionType.INVESTMENT]: transactionsTotal > 0 ? Math.round(
      (Number(investmentsTotal || 0) / Number(transactionsTotal)) * 100,
    ) : 0,
  };
  const totalExpensePerCategory: TotalExpensePerCategory[] = (
    await db.transaction.groupBy({
      by: ["category"],
      where: {
        ...where,
        type: TransactionType.EXPENSE,
      },
      _sum: {
        amount: true,
      },
    })
  ).map((category) => ({
    category: category.category,
    totalAmount: Number(category._sum.amount),
    percentageOfTotal: expensesTotal > 0 ? Math.round(
      (Number(category._sum.amount) / Number(expensesTotal)) * 100,
    ) : 0,
  }));
  const lastTransactions = (
    await db.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      take: 15,
    })
  ).map((transaction) => ({
    ...transaction,
    amount: Number(transaction.amount),
  }));
  return {
    balance,
    depositsTotal,
    investmentsTotal,
    expensesTotal,
    typesPercentage,
    totalExpensePerCategory,
    lastTransactions,
  };
};
