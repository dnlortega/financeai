import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import { getBudgets } from "../_data/get-budgets";
import { TransactionCategory } from "@prisma/client";
import BudgetItem from "./_components/budget-item";
import TotalBudgetItem from "./_components/total-budget-item";

const BudgetsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const { categoryBudgets, totalBudget } = await getBudgets();

  const categories = Object.values(TransactionCategory).filter(
    (c) => c !== TransactionCategory.SALARY
  );

  return (
    <>
      <Navbar />
      <div className="flex flex-col space-y-6 p-4 md:p-10 max-w-4xl mx-auto w-full">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Limites de Gastos</h1>
          <p className="text-muted-foreground text-foreground opacity-70">
            Gerencie seu orçamento global e por categoria.
          </p>
        </div>

        <TotalBudgetItem initialAmount={totalBudget || 0} />

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Limites por Categoria</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {categories.map((category) => {
              const budget = categoryBudgets.find((b) => b.category === category);
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
      </div>
    </>
  );
};

export default BudgetsPage;
