import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const getAvailableMonths = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Busca todas as datas de transações do usuário
  const transactions = await db.transaction.findMany({
    where: { userId },
    select: { date: true },
    orderBy: { date: "desc" },
  });

  // Mapeia para um formato único de MM/YYYY
  const months = transactions.map((t) => {
    const date = new Date(t.date);
    return {
      month: (date.getMonth() + 1).toString().padStart(2, "0"),
      year: date.getFullYear().toString(),
      label: date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
    };
  });

  // Remove duplicatas
  const uniqueMonths = Array.from(
    new Map(months.map((m) => [`${m.month}/${m.year}`, m])).values(),
  );

  return uniqueMonths;
};
