import { CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Progress } from "@/app/_components/ui/progress";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transactions";
import { TotalExpensePerCategory } from "@/app/_data/get-dashboard/types";
import { Budget } from "@/app/_data/get-budgets";
import UpsertBudgetDialog from "@/app/_components/upsert-budget-dialog";
import { formatCurrency } from "@/app/_utils/currency";

interface ExpensesPerCategoryProps {
  expensesPerCategory: TotalExpensePerCategory[];
  categoryBudgets: Budget[];
}

const ExpensesPerCategory = ({
  expensesPerCategory,
  categoryBudgets,
}: ExpensesPerCategoryProps) => {
  return (
    <ScrollArea className="col-span-2 h-full rounded-md border pb-6">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="font-bold">Gastos por Categoria</CardTitle>
        <UpsertBudgetDialog />
      </CardHeader>

      <CardContent className="space-y-6">
        {expensesPerCategory.map((category) => {
          const budget = categoryBudgets.find((b) => b.category === category.category);
          const budgetAmount = budget?.amount || 0;
          const percentageOfBudget = budgetAmount
            ? Math.round((category.totalAmount / budgetAmount) * 100)
            : 0;
          const isOverBudget = percentageOfBudget >= 100;

          return (
            <div key={category.category} className="space-y-2">
              <div className="flex w-full justify-between">
                <p className="text-sm font-bold">
                  {TRANSACTION_CATEGORY_LABELS[category.category]}
                </p>
                <p className={`text-sm font-bold ${isOverBudget ? "text-red-500" : ""}`}>
                  {budgetAmount ? `${percentageOfBudget}% do limite` : `${category.percentageOfTotal}% do total`}
                </p>
              </div>
              <Progress 
                value={budgetAmount ? percentageOfBudget : category.percentageOfTotal} 
                className={isOverBudget ? "[&>div]:bg-red-500" : ""}
              />
              {budgetAmount > 0 && (
                <p className="text-xs text-muted-foreground text-foreground opacity-70">
                  {formatCurrency(category.totalAmount)} / {formatCurrency(budgetAmount)}
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </ScrollArea>
  );
};

export default ExpensesPerCategory;
