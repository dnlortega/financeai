import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import { getBudgets } from "../_data/get-budgets";
import { TransactionCategory } from "@prisma/client";
import BudgetItem from "./_components/budget-item";

const BudgetsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const budgets = await getBudgets();

  const categories = Object.values(TransactionCategory).filter(
    (c) => c !== TransactionCategory.SALARY // Não faz sentido ter orçamento para salário
  );

  return (
    <>
      <Navbar />
      <div className="flex flex-col space-y-6 p-6 md:p-10 max-w-4xl mx-auto w-full">
        <div>
          <h1 className="text-2xl font-bold">Limites de Gastos</h1>
          <p className="text-muted-foreground text-foreground opacity-70">
            Defina quanto você pretende gastar em cada categoria por mês.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((category) => {
            const budget = budgets.find((b) => b.category === category);
            return (
              <BudgetItem
                key={category}
                category={category}
                initialAmount={budget?.amount || 0}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default BudgetsPage;
